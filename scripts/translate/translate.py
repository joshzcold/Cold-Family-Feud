from googletrans import Translator
import json
import sys
import re
translator = Translator(service_urls=['translate.google.com'])

f = open(sys.argv[1], "r")
translation_obj = json.loads(f.read())
new_obj = {}
language_id = sys.argv[2]

for key, val in translation_obj.items():
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
        print(f"translating {key} -> {no_period}")
        new_obj[key] = no_period
    else:
        translation = translator.translate(key, dest=language_id)
        print(f"translating {key} -> {translation.text}")
        new_obj[key] = translation.text.replace(".", "")

f = open(f"{language_id}-translation.json", "w")

f.write(json.dumps(new_obj, indent=4))
print(json.dumps(new_obj))
