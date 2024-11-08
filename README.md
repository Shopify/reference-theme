# Purpose of reference theme

This theme has been created to show an implementation of theme blocks. It is designed as a supplement to the [theme block documentation](https://shopify.dev/docs/themes/architecture/blocks/theme-blocks) and can be used as both a reference and a starting point for theme developers to experiment with the new feature.

# Getting the reference theme

To install the reference theme, [create a new development store](https://help.shopify.com/en/partners/dashboard/managing-stores/development-stores) and select the "Theme blocks" developer preview.

Then, download the `.zip` from the [latest release](https://github.com/Shopify/reference-theme/releases) in this repository and upload it in `Online store > Themes > Add theme`.

# Theme blocks

## Overview

Theme blocks are a new feature for online stores that allow theme developers to create blocks that can be used within different sections, as opposed to local blocks which are bound to a particular section.

### Benefits of theme blocks

* Less duplicate code
* More consistent merchant experience
* Theme blocks can be nested
* More flexible sections

## Creating theme blocks

To create a theme block, you need to create a new Liquid file in the `blocks` folder at the root of your theme.

Structurally, the file resembles a section, with a Liquid body and a Schema. The schema is used to define the block's name, tag, classes, settings, and presets that will be available to the merchant when using it.

For more details, see the [theme block documentation](https://shopify.dev/docs/themes/architecture/blocks/theme-blocks).

<details>
<summary>Example text block</summary>

```
{{ block.settings.text }}

{% schema %}
{
  "name": "Text",
  "settings": [
    {
      "type": "richtext",
      "id": "text",
      "label": "Text",
      "default": "<p>...</p>"
    }
  ],
  "presets": [{ "name": "Rich text" }]
}
{% endschema %}
```
</details>

Note that a preset is required for a theme block to appear in the editor, the same as for sections.

Also, if the outermost element of a block needs to have properties outside of a specific tag and class, you can use `"tag": null` to remove the auto-wrapper tag. If you do this, the block can only have one top level element in its Liquid body and that element must include `{{ block.shopify_attributes }}` to work properly in the editor. See [theme block documentation](https://shopify.dev/docs/themes/architecture/blocks/theme-blocks) for more details.

## Accepting theme blocks in sections

To accept theme blocks in a section, you must include `"blocks": [{"type": "@theme"}]` in its schema and `{% content_for "blocks"}`

Note that theme blocks and local blocks cannot be used in the same section.

## Referencing theme blocks in JSON templates

To include theme blocks in your JSON templates, add a section that accepts them in the editor and then click "add block" in the section sidebar.  You will see a list of theme blocks and can add them to the section.

You can also do this directly in the JSON file. You must include a `"blocks"` key and a `"block_order"` key in your section.

<details>
<summary>Example JSON with theme blocks</summary>

```
{
  "sections": {
    "example-section": {
      "type": "custom-section",
      "blocks": {
        "example-block": {
          "type": "heading",
          "settings": {
            "heading": "Multimedia collage",
            "heading_size": "h2"
          }
        }
      },
      "block_order": [
        "example-block"
      ]
    }
  },
  "order": [
    "example-section"
  ]
}
```
</details>

## Nesting blocks

`{% content_for "blocks" %}` can also be added to a block's body to allow nesting of theme blocks within it. You must also include `"blocks": [{"type": "@theme"}]` in the block's schema.

Block nesting can go up to 8 levels deep.

## Theme editor

The theme editor now includes drag and drop interactions in the power preview for theme blocks, allowing quick and easy block reordering for merchants.

## Theme block presets

Like sections, blocks can have presets. This allows blocks to be used in more flexible ways.

A block must have at least one preset to appear for selection in the Theme Editor.

## Theme block targeting

A section or group that accepts theme blocks can indicate either that it accepts all blocks (and apps) by adding `"blocks": [{ "type": "@theme" }, { "type": "@app" }]` to the schema.  Or it can target specific blocks by adding `"blocks": [{ "type": "slide" }]`.

By default, the block picker will show all theme blocks, but there are cases where you might want to control the blocks that are available to add. Theme developers can name a block with an underscore prefix to exclude it from appearing in the block picker for sections and theme blocks that accept blocks with type `@theme`.

For example, `slide` is a type of block that should only be available in `slideshow` sections. This can be done by naming your slide block `blocks/_slide` and in your `slideshow` section, you can target it by using `"blocks": [{ "type": "_slide" }]`.

## Static theme blocks

Theme blocks can be referenced directly in Liquid using `content_for` as follows:

```
  {% content_for "block", type: "slideshow-controls", id: "slideshow-controls" %}
```

Settings for these blocks can be configured by the merchant via the theme editor.  They can also be configured by the theme developer in presets.  Their usage in presets is the same as a normal theme block except it includes  `"static": true` and requires a matching `id` to the one in the corresponding Liquid.

## Styles

Style settings can now be added to sections and blocks.  These are new input setting types that offer CSS styles for merchants to customize.

Currently the categories that exist are:

* `"type": "style.size_panel"` - This panel includes CSS properties like `width`, `height`, and `flex-grow`.
* `"type": "style.spacing_panel"` - This panel includes CSS properties like `flex-direction`, `justify-content`, and `align items`.
* `"type": "style.layout_panel"` - This panel includes CSS properties like `padding` and `margin`.

These settings are applied via the new filter `class_list`, which renders the set of classes that correspond to the used style settings within a section or block.  It is used as follows: `<div class="{{ block.settings | class_list }}">`.  In a section, `section.settings` is used instead.

You can also apply different classes to different elements, for example:

```
<div class="{{ block.settings.size | class_list }}">...</div>
<div class="{{ block.settings.layout | class_list }}">...</div>
```

As with a normal setting, it is accessed via its ID.
