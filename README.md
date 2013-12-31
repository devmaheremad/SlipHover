SlipHover
=========

Apply direction aware hover animation to images or other elements


Quick Start
---

1.Just like using other jQuery plugins, first include the jQuery and the plugin js file to your page

```html
<script src="path/to/jquery.min.js"></script>
<script src="path/to/sliphover.js"></script>
```

2. Simply select the container element you want to apply to. The target can be any element.
say we have the following HTML structure:

```html
<div id="container">
  <img src="1.jpg" title="title1" />
  <img src="2.jpg" title="title2" />
  ...
</div>
```

then we simply apply effect to the container.

```javascript
$("#container").sliphover();
```