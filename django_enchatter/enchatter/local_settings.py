ALLOWED_HOSTS = ['localhost', 'a3chat.net']
DEBUG = True

FERNET_KEYS = [
    'new key for encrypting',
    'older key for decrypting old data',
]


LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'root': {
        'level': 'DEBUG',
        'handlers': ['logfile'],
    },
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(module)s '
                      '%(process)d %(thread)d %(message)s'
        },
        'minimal': {
            'format': '%(asctime)s %(message)s'
        },
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose'
        },
        'logfile': {
            'level': 'DEBUG',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': "enchatter.log",
            'maxBytes': 500000,
            'backupCount': 2,
            'formatter': 'verbose',
        },
    },
    'loggers': {
        '': {
            'level': 'DEBUG',
            'handlers': ['logfile'],
        },
        'daphne': {
            'handlers': [
                'console',
            ],
            'level': 'DEBUG',
            'propagate': False
        },
        'enchatter': {
            'handlers': [
                'console',
            ],
            'level': 'DEBUG',
            'propagate': False
        },
    },
}



FERNET_KEYS = [
    'EuPPbm4bPAcXi7XLVuTKokbmSQTJWraXFU4k5ca2SWHq5uLkpmsXoqxeYEyc6RcVJttm4no4hWXrJwi6LEAUiLDZJa5gRF4HowP4W7XaaMRRUqZivhHseZ36n5gRC82F',
    'SjF5zFDJP27ye5qQgBd5ZPqiT3pkC57QVp4Xviu8SWp85cffDfyNWzxCynXfcSjWsiedZBDwUiahpZfcxBYtFBRrA7ai8n9yPDsaDZ56LQQ6PUiesXAGtcYcLa2WsAKC',
    'rre5JbnTKP7KYY7CebBcXqQ6YKR8yLhysUZcxBvD7zqtK9bm34GkMa8SnmRzwKUjShEytjTdvY5Lxva9o79EobQPwPkARRhDBFaiHdLawbAxxy56jsxitQAeehfkdzHU',
    'tb5LKQZwGFW2PCFnHb6cBU7WDvuHoryMNHkkHDAKthD6ck5RtuJUfvsHDZJnEmE3PGiNTVT8XMRhXHPVFQayhdKdLTzz2q8edC8tvA8k3pu3667k7fg46rshG3cTKo49',
    'asdfsdaf85654a658165ad65sd15as1d65a1ds5',
    'new key for encrypting',
    'older key for decrypting old data',
]

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('127.0.0.1', 6379)],
            "symmetric_encryption_keys": ["4iD7GLKxChwPUniczQXnNuHoJ43neHoEiLWpJB6kQ8MmBWSXMpiRAXB2ikdKr7TxJnnJacDQGoTrHpVbyJ64NpSusYt7JmYEjMFLch2VuEmSSj22Y4Cu38eFfLRhQoMN"],
        },
    },
}

CSRF_COOKIE_DOMAIN = "bad.com"
SESSION_COOKIE_DOMAIN = "bad.com"