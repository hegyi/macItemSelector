
describe("Node", function() {
  var parent, child1, child2, child3, child4;
  beforeEach(function() {
    element = $('<div></div>');
    $(element).macItemSelector({json: {}});

    parent = $(element).macItemSelector("createNode","p","parent");
    child1 = $(element).macItemSelector("createNode","c1","child1");
    child2 = $(element).macItemSelector("createNode","c2","child2");
    child3 = $(element).macItemSelector("createNode","c3","child3");
    child4 = $(element).macItemSelector("createNode","c4","child4");
    child1.addChild(child3);
    child1.addChild(child4);
    parent.addChild(child1);
    parent.addChild(child2);

    //                   child3
    //          child1
    // parent            child4
    //          
    //          child2
  });


  it("should select all", function() {
    parent.toggle();
    expect([parent, child1,child2,child3,child4]).toBeSelected();
  });

  it("should unselect all", function() {
    parent.toggle();
    parent.toggle();
    expect([parent, child1,child2,child3,child4]).toBeUnselected();
  });

  it("should partially fill the parent nodes when there are selected and unselected children", function() {
    child3.toggle();
    expect([child3]).toBeSelected();
    expect([parent, child1]).toBePartiallyFilled();
    expect([child2, child4]).toBeUnselected();
  });

  it("should select child2 and partially fill the parent", function() {
    child2.toggle();
    expect([child1,child3,child4]).toBeUnselected();
    expect([child2]).toBeSelected();
    expect([parent]).toBePartiallyFilled();
  });

  it("should select child1, its children and fill select the parent", function() {
    child1.toggle();
    expect([child3, child4]).toBeSelected();
    expect([parent ]).toBePartiallyFilled();
    expect([child2]).toBeUnselected();
  });

  it("should select all when I toggle child4 and then I toggle parent", function() {
    child4.toggle();
    parent.toggle();
    expect([parent, child1,child2,child3,child4]).toBeSelected();
  });

  it("should select nothing when I toggle child4 and then toggle parent twice", function() {
    child4.toggle();
    parent.toggle();
    parent.toggle();
    expect([parent, child1,child2,child3,child4]).toBeUnselected();
  });

  it("should select the parent when all the children are selected", function() {
    child3.toggle();
    child4.toggle();
    expect([child1,child3,child4]).toBeSelected();
    expect([parent]).toBePartiallyFilled();
    expect([child2]).toBeUnselected();
  });

  it("should unselect the parent when all the children are unselected", function() {
    child3.toggle();
    child4.toggle();
    child3.toggle();
    child4.toggle();
    expect([parent, child1,child2,child3,child4]).toBeUnselected();
  });

  it("asdf", function() {
    child1.toggle();
    child1.toggle();
    child1.toggle();
    expect([child1,child3,child4]).toBeSelected();
  });

  it("should restore the partially filled state after select all and unselect all", function() {
    parent.toggle();
    child4.toggle();
    parent.toggle();
    parent.toggle();
    parent.toggle();
    expect([child3]).toBeSelected();
    expect([parent, child1]).toBePartiallyFilled();
    expect([child4]).toBeUnselected();
  });

  describe("find_by_id()", function(){
    it("should return the node by id", function() {
      var node = parent.find_by_id("c3");
      expect(node).toBe(child3);
    });
  });


  describe("selectedNodes()", function(){
    it("should return the selected nodes without parent nodes", function() {
      parent.toggle();
      child4.toggle();
      var nodes = parent.selectedNodes();
      expect(nodes.length).toBe(2);
      expect(nodes).toContain(child2);
      expect(nodes).toContain(child3);
    });
  });


});
