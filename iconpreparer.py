import os
import re
from pathlib import Path

def get_icons_folder() -> str:
   return os.path.join(os.getcwd(), "src/assets/icons/")

def edit_svg(svg_text: str, file_name: str) -> str:

   # remove width, height and id attributes
   svg_text = re.sub(r"( width| height| id)=\"([^']*?)\"", " ", svg_text)

   svg_id = file_name.removesuffix(".svg")
   svg_text = svg_text.replace("<svg", f'<svg id="{svg_id}"')
   svg_text = svg_text.replace("\"  ", "\" ")

   return svg_text

# replace all hardcoded colors with 'currentColor' (the current css color)
def replace_colors(svg_text: str) -> str:
   svg_text = re.sub(r"fill=\"\#([^']*?)\"", 'fill="currentColor"', svg_text)
   svg_text = re.sub(r"stroke=\"\#([^']*?)\"", 'stroke="currentColor"', svg_text)
   return svg_text

def prepare_svgs():
   for filename in os.listdir(get_icons_folder()):
      if not filename.endswith(".svg"):
         continue
      with open(os.path.join(get_icons_folder(), filename), 'r+') as svg:
         svg_text = svg.read()

         original_text = svg_text

         svg_text = edit_svg(svg_text, filename)
         svg_text = replace_colors(svg_text)

         if svg_text != original_text:
            svg.seek(0)
            svg.write(svg_text)
            svg.truncate()
            print(f"edited {filename}")

def create_ts_string_literal_type():
    string_literal = "export type IconName =\n"
    for filename in os.listdir(get_icons_folder()):
        if not filename.endswith(".svg"):
            continue

        string_literal += f' "{filename.removesuffix(".svg")}" |\n'
    string_literal = string_literal.removesuffix(" |\n") + ";"

    ts_path = os.path.join(os.getcwd(), "src/app/shared/icon/icon-name.ts")

    with open(ts_path, "w") as ts_file:
        ts_file.seek(0)
        ts_file.write(string_literal)
        ts_file.truncate()

print("Preparing svg icons for use with IconComponent...")
prepare_svgs()
create_ts_string_literal_type()
