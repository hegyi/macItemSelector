/*!
 * Copyright (c) 2012 Adam Hegyi
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */
;(function($) {
  var pluginName = 'macItemSelector';

  function Plugin(element, options) {
    var el = element;
    var $el = $(element);
    var nodes = null; // array of parent nodes
    var current_id = null; // currently clicked node

    options = $.extend({}, $.fn[pluginName].defaults, options);

    // Constructor

    function init() {
      if(options['json'] != null) {
        nodes = createNodesFromJson(options['json']);
      } else if(options['nodes'] != null) {
        nodes = createNodes(options['nodes']);
      } else {
        console.error("'json' or 'nodes' input parameter is missing!");
      }
      render();

      // Event delegations

      $(el).on("click", 'div.mac-item-selector-name', function() {
        current_id = $(this).data("row-id");
        render();
      });

      if(options['allowClickOnRow']) {
        $(el).on("click", 'div.mac-item-selector-row', function() {
          current_id = $(this).find('div.mac-item-selector-name:first').data("row-id");
          render();
        });
      }

      $(el).on("click", 'div.mac-item-selector-checkbox', function() {
        current_id = $(this).data("row-id");
        var node = findNode(current_id);
        node.toggle();
        render();
      });
    }

    // Render related methods

    function render() {
      $(el).html(draw());
    }

    function drawText(node) {
      var classes = "mac-item-selector-name mac-item-selector-left";
      var name = options['nameStyle'](node['name']);
      return $('<div class="' + classes + '" data-row-id="' + node['id'] + '">' + name + '</div>');
    }

    function drawCheckbox(node) {
      var classes = "mac-item-selector-checkbox mac-item-selector-left mac-item-selector-checkbox-" + node.getState();
      return $('<div class="' + classes + '" data-row-id="' + node['id'] + '"></div>');
    }

    function drawRow(node) {
      var row_container = $('<div class="mac-item-selector-row"></div>');
      row_container.append(drawCheckbox(node));
      row_container.append(drawText(node));
      if(node.hasChildren()) {
        row_container.append(options['hasChildrenSymbol']());
      }
      row_container.append('<div class="mac-item-selector-clear"></div>');
      return row_container;
    }

    function draw() {
      if(current_id == null) {
        return drawColumn(nodes);
      } else {
        var node = findNode(current_id);
        if(node != null) {
          var elem = $("<div></div>");
          var column = drawColumn(node.getChildren());
          elem.prepend(column);
          while(node.hasParent()) {
            parent = node.getParent();
            column = drawColumn(parent.getChildren());
            elem.prepend(column);
            node = node.getParent();
          }
          elem.prepend(drawColumn(nodes));
          return elem;
        }                 
      }
    }

    function drawColumn(nodes) {
      if(nodes.length > 0) {
        var column = $('<div class="mac-item-selector-column"></div>');
        for(i in nodes) {
          $(column).append(drawRow(nodes[i]));
        }
        return column;
      }
    }

    // Node object

    function Node(id, name) {
      this.id = id;
      this.name = name;
      this.storage = null;
      this.states = ["unselected", "selected", "partially-filled"];
      this.state = 0;
      this.parent = null;
      this.children = [];
    }


    Node.prototype.toggle = function() {
      if(this.isUnselected()) {
        if(this.hasStoredState()) {
          this.restoreState();
          this.restoreChildren();
          this.notifyParent();
        } else {
          this.setSelected();
          this.notifyChildren();
          this.notifyParent();
        }
      } else if(this.isSelected()) {
        this.setUnselected();
        this.notifyChildren();
        this.notifyParent();
      } else if(this.isPartiallyFilled()) {
        this.backup();
        this.setSelected();
        this.selectAllChildren();
      }
    };

    Node.prototype.restoreChildren = function() {
      if(this.hasChildren()) {
        var children = this.getChildren();
        for(i in children) {
          children[i].restoreState();
          children[i].restoreChildren();
        }
      }   
    };

    Node.prototype.selectAllChildren = function() {
      if(this.hasChildren()) {
        var children = this.getChildren();
        for(i in children) {
          children[i].backup();
          children[i].setSelected();
          children[i].selectAllChildren();
        }
      }
    };

    Node.prototype.notifyParent = function() {
      if(this.hasParent()) {
        var node = this.parent;
        if(node.hasOnlySelectedChildren()) {
          node.setState("selected");
        } else if(node.hasOnlyUnselectedChildren()) {
          node.setState("unselected");
        } else if(node.hasSelectedAndUnselectedOrPartiallyFilledChildren()){
          node.setState("partially-filled");
        }
        node.notifyParent();
      }
    }                                             

    Node.prototype.hasOnlySelectedChildren = function() {
      var children = this.getChildren();
      for(i in children) {
        if(!children[i].isSelected()) {
          return false;
        }
      }
      return true;
    }

    Node.prototype.hasOnlyUnselectedChildren = function() {
      var children = this.getChildren();
      for(i in children) {
        if(!children[i].isUnselected()) {
          return false;
        }
      }
      return true;
    }

    Node.prototype.hasSelectedAndUnselectedOrPartiallyFilledChildren = function() {
      var children = this.getChildren();
      var selected = 0;
      var unselected = 0
      for(i in children) {
        if(children[i].isSelected()) {
          selected += 1;
        } else if(children[i].isUnselected()) {
          unselected += 1;
        } else {
          return true;
        }
      }
      return selected > 0 && unselected > 0
    }

    Node.prototype.notifyChildren = function() {
      var children = this.getChildren();
      for(i in children) {
        children[i].toggle();
      }
    };

    Node.prototype.isUnselected = function() {
      return this.getState() == "unselected";
    };

    Node.prototype.isSelected = function() {
      return this.getState() == "selected";
    };

    Node.prototype.isPartiallyFilled = function() {
      return this.getState() == "partially-filled";
    };

    Node.prototype.setSelected = function() {
      this.setState("selected"); 
    };

    Node.prototype.setUnselected = function() {
      this.setState("unselected");
    };

    Node.prototype.backup = function() {
       this.storage = this.state;
    };

    Node.prototype.restoreState = function() {
      this.state = this.storage;
      this.storage = null;
    };

    Node.prototype.getState = function() {
      return this.states[this.state];
    };

    Node.prototype.setState = function(state) {
      this.state = this.states.indexOf(state);
    }

    Node.prototype.hasChildren = function() {
      return this.children.length != 0;
    };

    Node.prototype.hasStoredState = function() {
      return this.storage != null;
    };

    Node.prototype.hasParent = function() {
      return this.parent != null;
    };

    Node.prototype.setParent = function(parent) {
      this.parent = parent;
    };

    Node.prototype.getParent = function() {
      return this.parent;
    };

    Node.prototype.addChild = function(child) {
      child.setParent(this);
      this.children.push(child);
    };

    Node.prototype.getChildren = function() {
      return this.children;
    };

    Node.prototype.selectedNodes = function() {
      var nodes = [];
      if(this.isUnselected()) {
        return nodes;
      } else if(this.hasChildren()) {
        var children = this.getChildren();
        for(i in children) {
          if(!this.isUnselected()) {
            nodes = nodes.concat(children[i].selectedNodes());
          }
        }
      } else {
        nodes.push(this);
      }
      return nodes;
    }   


    Node.prototype.find_by_id = function(id) {
      if(this.id == id) {
        return this;
      } else { 
        var children = this.getChildren();
        for(i in children) {
          if(children[i].id == id) {
            return children[i];
          } else {
            child = children[i].find_by_id(id);
            if(child != null) {
              return child;
            }
          } 
        }
      }
      return null;
    };

    // NodeBuilder object

    function NodeBuilder(json) {
      this.json = json;
    }

    NodeBuilder.prototype.build = function() {
      var array = [];
      for(i in this.json) {
        hash = this.json[i];
        node = new Node(hash['id'], hash['name']);
        if(node['children'] == null) {
          this.buildNode(node, []);
        } else {
          this.buildNode(node, hash['children']);
        }
          array.push(node);
      }
      return array;
    }
    NodeBuilder.prototype.buildNode = function(node, children) {
      for(i in children) {
        child = new Node(children[i]['id'], children[i]['name']);
        node.addChild(child);
        if(children[i]['children'] == null) {
          this.buildNode(child, []);
        } else {
          this.buildNode(child, children[i]['children']);
        }
      }
    }

    // public API calls

    function toggle(id) {
      var node = findNode(id);
      if(node != null) {
        node.toggle();
        render();
      }
    }

    function findNode(id) {
      var root = nodes;
      for(i in root) {
        var node = null;
        if(node == null) {
          node = root[i].find_by_id(id);
        }
        if(node != null) {
          return node;
        }
      }
      console.error("Cannot find node with the id: " + id);
      return null;
    }

    function selectedNodes() {
      var selected = [];
      for(i in nodes) {
        selected = selected.concat(nodes[i].selectedNodes());
      }
      return selected;
    }

      function selectedNodesAsJSON() {
        var selected = selectedNodes();
        var json = [];
        for(i in selected) {
          json.push({id: selected[i].id, name: selected[i].name})
        }
      return JSON.stringify(json);
    }

    function createNode(id, name) {
      var node = new Node(id, name);
      return node;
    }

    function createNodesFromJson(json) {
      var obj = JSON.parse(json);
      return createNodes(obj)
    }

    function createNodes(obj) {
      return new NodeBuilder(obj).build();
    }

    function option (key, val) {
      if (val) {
        options[key] = val;
      } else {
        return options[key];
      }
    }

    function destroy() {
      $el.each(function() {
        var el = this;
        var $el = $(this);

        $el.removeData('plugin_' + pluginName);
        $(el).html('');
      });
    }

    init();

    return {
      option: option,
        destroy: destroy,
        toggle: toggle,
        createNode: createNode,
        createNodesFromJson: createNodesFromJson,
        createNodes: createNodes,
        selectedNodes: selectedNodes,
        selectedNodesAsJSON: selectedNodesAsJSON
    };
  }

  $.fn[pluginName] = function(options) {
    if (typeof arguments[0] === 'string') {
      var methodName = arguments[0];
      var args = Array.prototype.slice.call(arguments, 1);
      var returnVal;
      this.each(function() {
        if ($.data(this, 'plugin_' + pluginName) && typeof $.data(this, 'plugin_' + pluginName)[methodName] === 'function') {
          returnVal = $.data(this, 'plugin_' + pluginName)[methodName].apply(this, args);
        } else {
          throw new Error('Method ' +  methodName + ' does not exist on jQuery.' + pluginName);
        }
      });
      if (returnVal !== undefined){
        return returnVal;
      } else {
        return this;
      }
    } else if (typeof options === "object" || !options) {
      return this.each(function() {
        if (!$.data(this, 'plugin_' + pluginName)) {
          $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
        }
      });
    }
  };

  $.fn[pluginName].defaults = {
    nodes: null,
    json: null,
    allowClickOnRow: false,
    hasChildrenSymbol: function() { 
      return $('<div class="mac-item-selector-has-more mac-item-selector-right"></div>');
    },
    nameStyle: function(name) {
      return name;
    }
  };

})(jQuery);
