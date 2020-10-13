import base64

from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils.decorators import method_decorator
from django.views.decorators.debug import sensitive_post_parameters
from rest_auth.registration.app_settings import register_permission_classes
from rest_auth.views import LoginView as OriginalLoginView
from rest_framework.mixins import CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, ListModelMixin, \
    DestroyModelMixin

from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.generics import CreateAPIView
from rest_framework import status

from allauth.account.utils import complete_signup

from rest_auth.app_settings import (TokenSerializer,
                                    JWTSerializer,
                                    create_token)
from rest_auth.models import TokenModel
from rest_auth.utils import jwt_encode
from rest_framework.viewsets import GenericViewSet

from enchatter.permisions import IsStaffOrAdminLaddered
from enchatter.settings import FRONTEND_URL
from authorization.serializers import RegisterSerializer, InviteCreateSerializer, UserSerializer

sensitive_post_parameters_m = method_decorator(
    sensitive_post_parameters('password1', 'password2')
)
User = get_user_model()


class InviteCreateView(CreateAPIView):
    permission_classes = (IsAdminUser,)
    serializer_class = InviteCreateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        invite = serializer.save()
        invite.inviter = self.request.user
        invite.save()
        headers = self.get_success_headers(serializer.data)
        link = "{}/register/{}".format(FRONTEND_URL, invite.key)
        return Response({"link": link}, status=status.HTTP_201_CREATED, headers=headers)


class RegisterView(CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = register_permission_classes()
    token_model = TokenModel

    @sensitive_post_parameters_m
    def dispatch(self, *args, **kwargs):
        return super(RegisterView, self).dispatch(*args, **kwargs)

    def get_response_data(self, user):
        return {
            'key': user.auth_token.key,
            'staff': user.is_staff,
            'admin': user.is_superuser
        }

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        return Response(self.get_response_data(user),
                        status=status.HTTP_201_CREATED,
                        headers=headers)

    def perform_create(self, serializer):
        user = serializer.save(self.request)
        if getattr(settings, 'REST_USE_JWT', False):
            self.token = jwt_encode(user)
        else:
            create_token(self.token_model, user, serializer)

        complete_signup(self.request._request, user,
                        False,
                        None)
        return user


class LoginView(OriginalLoginView):
    def get_response(self):
        serializer_class = self.get_response_serializer()

        if getattr(settings, 'REST_USE_JWT', False):
            data = {
                'user': self.user,
                'token': self.token
            }
            serializer = serializer_class(instance=data,
                                          context={'request': self.request})
        else:
            data = {
                'key': self.token,
                'staff': self.user.is_staff,
                'admin': self.user.is_superuser,
            }
            serializer = serializer_class(instance=data,
                                          context={'request': self.request})

        return Response(serializer.data, status=status.HTTP_200_OK)


class AdminUserViewSet(CreateModelMixin,
                       RetrieveModelMixin,
                       UpdateModelMixin,
                       ListModelMixin,
                       DestroyModelMixin,
                       GenericViewSet):
    permission_classes = (IsAuthenticated, IsStaffOrAdminLaddered, )
    serializer_class = UserSerializer
    queryset = User.objects.all()
