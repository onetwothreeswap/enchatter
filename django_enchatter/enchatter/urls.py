from django.conf.urls import url
from django.urls import path, include
from rest_auth.views import LogoutView, UserDetailsView, PasswordChangeView
from rest_framework import routers

from authorization.views import RegisterView, InviteCreateView, LoginView, AdminUserViewSet
from chat.api.views import AdminMessagesViewSet


admin_router = routers.DefaultRouter()
admin_router.register(r'users', AdminUserViewSet)
admin_router.register(r'messages', AdminMessagesViewSet)

rest_auth_urls = [
    url(r'^login/$', LoginView.as_view(), name='rest_login'),
    url(r'^logout/$', LogoutView.as_view(), name='rest_logout'),
    url(r'^user/$', UserDetailsView.as_view(), name='rest_user_details'),
    url(r'^password/change/$', PasswordChangeView.as_view(),
        name='rest_password_change'),
]

rest_registration_urls = [
    url(r'^$', RegisterView.as_view(), name='register'),
    url(r'^create/$', InviteCreateView.as_view(), name='create_invite'),
]

urlpatterns = [
    url(r'admin/', include((admin_router.urls, "admin"), namespace='admin')),
    path('api-auth/', include('rest_framework.urls')),
    path('chat/', include('chat.api.urls', namespace='chat')),
    path('rest-auth/', include(rest_auth_urls)),
    path('rest-auth/registration/', include(rest_registration_urls)),
]
