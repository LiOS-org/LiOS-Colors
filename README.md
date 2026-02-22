<div align = "center">
    <a href="https://colors.liosorg.com">
        <img alt = "LiOS Colors" src = "public/assets/favicon/favicon.svg" width = "25%"/>
    </a>
    <h1>LiOS Colors</h1>
</div>

<p>
    LiOS-Colors is a browsable library of carefully curated colors,
    focused on translucent UI-friendly variants for modern interfaces.
</p>

> The website itself serves as the live preview —
> [colors.liosorg.com](https://colors.liosorg.com)

## Installation

### Using @import method:

```css
@import url("https://data.colors.liosorg.com/translucent-colors.css");
```

### Using git submodule add:

```bash
git submodule add https://github.com/LiOS-org/LiOS-Colors-Data.git
```
After submodule is added import it to your main CSS file:

```css
@import url("${path-to-LiOS-Colors-Data}/translucent-colors.css");
```

## Usage

Translucent colors works by using CSS variables to define a set of translucent color values that can be applied to elements in your design.

To use these colors, you must have the color in hex format and the color should also exist in LiOS-Colors database(verify by searching the color in the browse section).

Once you have the color in hex format and it exists in the database, you can use it in your CSS using variable names.

You can get the variable name by replacing `#` of the hex code with `--`, for example: `#4b62d2` becomes `--4b62d2`.

<p align="center">
  <a href="https://liosorg.com">LiOS Home</a> •
  <a href="https://colors.liosorg.com">LiOS Colors</a> •
  <a href="https://techinformal.liosorg.com">Tech Informal</a>
</p>

