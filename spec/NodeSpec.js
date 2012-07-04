
describe("Node", function() {
  var parent, child1, child2, child3, child4;
  beforeEach(function() {
    parent = new Node("p","parent");
    child1 = new Node("c1","child1");
    child2 = new Node("c2","child2");
    child3 = new Node("c3","child3");
    child4 = new Node("c4","child4");
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

  it("should partially select the parent nodes when there are selected and unselected children", function() {
    child3.toggle();
    expect([child3]).toBeSelected();
    expect([parent, child1]).toBePartiallySelected();
    expect([child2, child4]).toBeUnselected();
  });

  it("should select child2 and partially select the parent", function() {
    child2.toggle();
    expect([child1,child3,child4]).toBeUnselected();
    expect([child2]).toBeSelected();
    expect([parent]).toBePartiallySelected();
  });

  it("should select child1 and its children and partially select the parent", function() {
    child1.toggle();
    expect([child3, child4]).toBeSelected();
    expect([parent ]).toBePartiallySelected();
    expect([child2]).toBeUnselected();
  });

  it("should select all when I toggle child4 and then toggle parent", function() {
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
    expect([parent]).toBePartiallySelected();
    expect([child2]).toBeUnselected();
  });

  it("should unselect the parent when all the children are unselected", function() {
    child3.toggle();
    child4.toggle();
    child3.toggle();
    child4.toggle();
    expect([parent, child1,child2,child3,child4]).toBeUnselected();
  });


});
