function Node(id, name) {
  this.id = id;
  this.name = name;
  this.states = ["unselected", "selected", "partially selected"];
  this.state = 0;
  this.parent = null;
  this.children = [];
}

Node.prototype.toggle = function() {
  if(this.isUnselected()) {
    this.setSelected();
    this.notifyChildren();
    this.notifyParent();
  } else if(this.isSelected()) {
    this.setUnselected();
    this.notifyChildren();
    this.notifyParent();
  } else if(this.isPartiallySelected()) {
    this.setSelected();
    this.selectAllChildren();
  }
};

Node.prototype.selectAllChildren = function() {
  if(this.hasChildren()) {
    var children = this.getChildren();
    for(i in children) {
      children[i].setState("selected");
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
    } else if(node.hasSelectedAndUnselectedOrPartiallySelectedChildren()){
      node.setState("partially selected");
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

Node.prototype.hasSelectedAndUnselectedOrPartiallySelectedChildren = function() {
  var children = this.getChildren();
  var selected = 0;
  var unselected = 0
  var partially_selected = 0
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

Node.prototype.isPartiallySelected = function() {
  return this.getState() == "partially selected";
};

Node.prototype.setSelected = function() {
  this.setState("selected");
};

Node.prototype.setUnselected = function() {
  this.setState("unselected");
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

