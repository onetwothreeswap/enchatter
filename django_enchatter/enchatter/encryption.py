# -*- coding: utf-8 -*-

from cryptography.fernet import Fernet
import tinyec.ec as ec


EC_CURVE_REGISTRY = {"secp256k1": {"p": 0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f,
                                   "a": 0x0000000000000000000000000000000000000000000000000000000000000000,
                                   "b": 0x0000000000000000000000000000000000000000000000000000000000000007,
                                   "g": (0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798,
                                         0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8),
                                   "n": 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141,
                                   "h": 0x1}
                     }


def get_tinyec_curve(name):
    curve_params = {}
    for k, v in EC_CURVE_REGISTRY.items():
        if name.lower() == k.lower():
            curve_params = v
    if curve_params == {}:
        raise ValueError("Unknown elliptic curve name")
    try:
        sub_group = ec.SubGroup(curve_params["p"], curve_params["g"], curve_params["n"], curve_params["h"])
        curve = ec.Curve(curve_params["a"], curve_params["b"], sub_group, name)
    except KeyError:
        raise RuntimeError("Missing parameters for curve %s" % name)
    return curve
