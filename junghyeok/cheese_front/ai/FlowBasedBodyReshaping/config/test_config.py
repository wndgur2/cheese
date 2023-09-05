from easydict import EasyDict

# Base default config
TESTCONFIG = EasyDict({})

TESTCONFIG.pose_estimation_ckpt = "ai/FlowBasedBodyReshaping/models/body_pose_model.pth"
TESTCONFIG.suppress_bg = True

TESTCONFIG.flow_scales = []  # available scale  ['upper_0.2','lower_0.2', 'upper_2']

TESTCONFIG.degree = 1.0

TESTCONFIG.divider = 20

TESTCONFIG.reshape_ckpt_path = 'ai/FlowBasedBodyReshaping/models/body_reshape_model.pth'

TESTCONFIG.src_dir = ''
TESTCONFIG.gt_dir = ''
TESTCONFIG.save_dir = './test_output'

def load_config(custom_config, default_config=TESTCONFIG, prefix="CONFIG"):
    if "is_default" in default_config:
        default_config.is_default = False

    for key in custom_config.keys():
        full_key = ".".join([prefix, key])
        if key not in default_config:
            raise NotImplementedError("Unknown config key: {}".format(full_key))
        elif isinstance(custom_config[key], dict):
            if isinstance(default_config[key], dict):
                load_config(default_config=default_config[key],
                            custom_config=custom_config[key],
                            prefix=full_key)
            else:
                raise ValueError("{}: Expected {}, got dict instead.".format(full_key, type(custom_config[key])))
        else:
            if isinstance(default_config[key], dict):
                raise ValueError("{}: Expected dict, got {} instead.".format(full_key, type(custom_config[key])))
            else:
                default_config[key] = custom_config[key]

