function NodeBuilder(json) {
  this.json = json;
}

NodeBuilder.prototype.build = function() {
  var array = [];
  for(i in this.json) {
    hash = this.json[i];
    node = new Node(hash['id'], hash['name']);
    this.buildNode(node, hash['children'])
    array.push(node);
  }
  return array;
}
NodeBuilder.prototype.buildNode = function(node, children) {
  for(i in children) {
    child = new Node(children[i]['id'], children[i]['name']);
    node.addChild(child);
    this.buildNode(child, children[i]['children']);
  }
}
