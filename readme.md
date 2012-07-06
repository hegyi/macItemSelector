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

* Use the plugin on an **empty div** selector:

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
  // create the plugin
  $("#my_conatiner").macItemSelector({nodes: exampleNodes });
});
```

### Plugin initialization parameters
* `nodes`: array of hashes (array of nodes for initialization)
* `json`: string (raw json for initialization)
* `allowClickOnRow`: boolean (allow to navigate by clicking on the row instead of just clicking on the text)
* `hasChildrenSymbol`: `function() { return "string"; }` (overriding the default symbol for non-empty nodes)
* `nameStyle`: `function(name) { return <b>name</b>; }` (overriding the default node name rendering)

For more example check `example.html` for more details!

### CSS classes
The plugin uses CSS to formatting its content. You can override the default look and feel by changing the following CSS classes.
* `.mac-item-selector-column`: style of columns
* `.mac-item-selector-row`: style of rows
* `.mac-item-selector-checkbox`: style of checkboxes
* `.mac-item-selector-checkbox-selected`: style of checkboxes when they are selected
* `.mac-item-selector-checkbox-unselected`: style of checkboxes when they are unselected
* `.mac-item-selector-checkbox-partially-filled`: style of checkboxes when they are partially-filled
* `.mac-item-selector-has-more`: style of non-empty nodes

### API methods

* `destroy`: removes the plugin
* `selectedNodes`: returns the selected leaf nodes in an array
* `selectedNodesAsJSON`: returns the selected leaf nodes as JSON string
* `toggle(id)`: toggles a node with the given ID


