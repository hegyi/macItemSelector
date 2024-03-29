describe("NodeBuilder", function() {
  var element = null;
  beforeEach(function() {
    element = $('<div></div>');
    $(element).macItemSelector({nodes: {}});
  });

  it("should build a node tree from array of hashes", function(){
    var obj = [
      {
        name: "component 1",
        id: "c1",
        children: [
          {
            name: "story 1",
            id: "s1",
            children: [
              {
                name: "inner 1",
                id: "i1",
                children: []
              },
              {
                name: "inner 2",
                id: "i2",
                children: []
              }
            ]
          }
        ]
      },
      {
        name: "component 2",
        id: "c2",
        children: []
      }
    ]
    nodes = $(element).macItemSelector("createNodes", obj);
    expect(nodes[0].name).toBe("component 1");
    expect(nodes[1].name).toBe("component 2");
    expect(nodes[0].children[0].name).toBe("story 1");
    expect(nodes[0].children[0].children[1].name).toBe("inner 2");
  });
});
