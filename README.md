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
