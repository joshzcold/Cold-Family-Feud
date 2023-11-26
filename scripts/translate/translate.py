from googletrans import Translator
import json
import sys
import re
OKGREEN = '\033[92m'
INFO_GRAY = '\033[90m'
WARNING = '\033[93m'
FAIL = '\033[91m'
RESET = '\033[0m'
translator = Translator(service_urls=['translate.google.com'])

f = open(sys.argv[1], "r")
translation_obj = json.loads(f.read())
new_obj = {}
language_id = sys.argv[2]

for key, val in translation_obj.items():
    print(INFO_GRAY, key, val, RESET)
    if not val == "__STRING_NOT_TRANSLATED__":
        new_obj[key] = val
    else:
        if "{{" in key:
            parts = re.split(r"{{.*?}}", key)
            aparts = re.findall('{{.*?}}', key)
            zipped = [j for i in zip(parts, aparts) for j in i]
            flip = True
            new_string = ""
            for text in zipped:
                if flip:
                    translation = translator.translate(text, dest=language_id)
                    new_string += f"{translation.text} "
                    flip = not flip
                else:
                    new_string += f"{text} "
                    flip = not flip

            # print(new_string)
            no_period = new_string.replace(".", "")
            print(OKGREEN, f"translating {key} -> {no_period}", RESET)
            new_obj[key] = no_period
        else:
            try:
                translation = translator.translate(key, dest=language_id)
                new_obj[key] = translation.text.replace(".", "")
                print(OKGREEN, f"translating {key} -> {translation.text}", RESET)
            except TypeError:
                new_obj[key] = key
                print(FAIL, "Could not translate", key, "to", language_id, RESET)

f = open(sys.argv[1], "w")
f.write(json.dumps(new_obj, indent=4))
print(json.dumps(new_obj))
