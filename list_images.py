import os
from pathlib import Path
import shutil

def list_image_files(perform_rename=False):
    # Define the path to the images folder
    images_folder = Path("public/images")
    
    # Check if the folder exists
    if not images_folder.exists() or not images_folder.is_dir():
        print(f"Error: The folder '{images_folder}' does not exist or is not a directory.")
        return False
    
    # Get all files in the folder
    files = [file.name for file in images_folder.iterdir() if file.is_file()]
    
    # Sort files alphabetically
    files.sort()
    
    # Create mapping of original filenames to new filenames (last 12 chars only)
    rename_mapping = {}
    for file in files:
        # Get file extension
        file_parts = os.path.splitext(file)
        extension = file_parts[1]  # e.g., .jpg
        
        # Extract the last 12 chars of the filename (before extension)
        # If filename is shorter than 12 chars, use the whole filename
        name_part = file_parts[0]
        new_name = name_part[-12:] if len(name_part) >= 12 else name_part
        
        # Create the new filename with the original extension
        new_filename = new_name + extension
        rename_mapping[file] = new_filename
    
    # Write to output file
    output_file = Path("image_list.txt")
    try:
        with open(output_file, 'w') as f:
            for old_name, new_name in rename_mapping.items():
                f.write(f"{old_name} -> {new_name}\n")
        print(f"Successfully wrote {len(files)} file names to {output_file}")
        
        # Perform actual renaming if requested
        if perform_rename:
            for old_name, new_name in rename_mapping.items():
                old_path = images_folder / old_name
                new_path = images_folder / new_name
                # Avoid overwriting existing files
                if new_path.exists():
                    print(f"Warning: Cannot rename {old_name} - {new_name} already exists")
                    continue
                try:
                    # Use shutil.move for safer renaming
                    shutil.move(str(old_path), str(new_path))
                    print(f"Renamed: {old_name} -> {new_name}")
                except Exception as e:
                    print(f"Error renaming {old_name}: {e}")
            print("Renaming complete")
        else:
            print("Dry run only. Set perform_rename=True to actually rename files")
            
        return True
    except Exception as e:
        print(f"Error writing to file: {e}")
        return False

if __name__ == "__main__":
    # Set this to True to perform actual renaming
    list_image_files(perform_rename=False)
