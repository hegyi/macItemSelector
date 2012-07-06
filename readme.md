# Mac Style Item Selector 
This is a single jQuery plugin for creating Mac like item selector.

## Requirements
  * jQuery

## Usage
* Download the plugin and copy the **jquery.mac-item-selector.js** from the **src** folder and the **mac-item-selector.css** from the **css** folder into your project directory
* Require the plugin and css in the header section of your HTML file:

```html
<script src="jquery.mac-item-selector.js" type="text/javascript"></script>
<link rel="stylesheet" type="text/css" href="css/mac-item-selector.css"></link>
```

* Use the plugin on an empty div selector:

```javascript
$(document).ready(function() {
  // create example nodes
  var exampleNodes = [
    {
       name: "component 1",
       id: "c1",
       children: [
         {
           name: "story 1",
           id: "s1",
           children: []
         }
       ]
    }
  ]

  $("#my_conatiner").macItemSelector({nodes: exampleNodes });
});
```
