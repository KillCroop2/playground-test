#!/bin/bash

# Source directory is the current directory
SOURCE_DIR="$(pwd)"
DEST_DIR="${SOURCE_DIR}/.claude"

EXCLUDE_PATHS=(
    "node_modules"
    ".pnp"
    ".pnp.js"
    "coverage"
    ".next"
    "out"
    "build"
    ".DS_Store"
    "*.pem"
    "npm-debug.log*"
    "yarn-debug.log*"
    "yarn-error.log*"
    ".pnpm-debug.log*"
    ".env*.local"
    ".vercel"
    "*.tsbuildinfo"
    "next-env.d.ts"
    ".idea"
    ".sentryclirc"
    "dist"
    "components/ui"
)

# Clear the destination directory if it exists, then create it
if [ -d "$DEST_DIR" ]; then
    echo "Clearing existing destination directory..."
    rm -rf "${DEST_DIR:?}"/*
else
    echo "Creating destination directory..."
fi
mkdir -p "$DEST_DIR"

# Convert the array of exclude paths to find's -name or -path options
EXCLUDE_FIND_ARGS=()
for path in "${EXCLUDE_PATHS[@]}"; do
    if [[ $path == *"*"* ]]; then
        EXCLUDE_FIND_ARGS+=( -name "$path" -o )
    else
        EXCLUDE_FIND_ARGS+=( -path "*/$path/*" -o -path "*/$path" -o )
    fi
done

# Find and copy relevant files, then rename them
find "$SOURCE_DIR" \
    \( "${EXCLUDE_FIND_ARGS[@]}" -path "$DEST_DIR" \) -prune -o \
    -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.css" -o -name "*.prisma" -o -name "*.webmanifest" \) -print0 | while IFS= read -r -d '' file; do
    # Get the relative path within the source directory
    relative_path="${file#$SOURCE_DIR/}"
    
    # Generate the new file name based on the full relative path
    new_file=$(echo "$relative_path" | sed 's/\//_/g')
    
    # Print the source and destination file paths for debugging
    echo "Copying $relative_path to $DEST_DIR/$new_file"
    
    # Copy the file to the destination directory with the new name
    cp "$file" "$DEST_DIR/$new_file" 2>&1 || { echo "Failed to copy $file"; exit 1; }
done

echo "Flattening process completed."