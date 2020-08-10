// module aliases
var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Body = Matter.Body,
  Events = Matter.Events,
  Detector = Matter.Detector,
  Composite = Matter.Composite,
  Composites = Matter.Composites,
  Constraint = Matter.Constraint,
  Mouse = Matter.Mouse,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Vector = Matter.Vector;

// create an engine and world
var engine = Engine.create();
var world = engine.world;

// create reference to our canvas
const canvas = document.querySelector("canvas");

// Create variable to keep track of our score
let score = 1;
// Create reference to our score element
const scoreElem = document.querySelector("#score");

// create a renderer
var render = Render.create({
  canvas: canvas,
  engine: engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false,
  },
});

// add function to resize our canvas when we resize the window
window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// create a collison group (for experimenting)
var cursors = Body.nextGroup(false);

// create the composite that will hold all our bones
let ropeA = Composite.create();

// Add our first cursor hand to the composite
// set size, sprite texture and scale
Composite.add(
  ropeA,
  Bodies.rectangle(window.innerWidth / 2, 300, 20, 40, {
    collisionFilter: { group: cursors },
    render: {
      sprite: {
        texture: "./cursor-active.png",
        xScale: 0.1,
        yScale: 0.1,
      },
    },
  })
);

// Add our composite to the world
World.add(world, ropeA);
// Create a mouse object for our canvas
var mouse = Mouse.create(render.canvas);

// Every frame move the root body of the rope to where the mouse is
// Set the velocity with a vector to where the mouse is
// to nudge it to the position instead of abruptly moving it
Events.on(engine, "beforeUpdate", function () {
  Body.setVelocity(ropeA.bodies[0], {
    x: (mouse.position.x - ropeA.bodies[0].position.x) * 0.3,
    y: (mouse.position.y - ropeA.bodies[0].position.y) * 0.3,
  });

  // Debugging code
  // Body.setVelocity(ropeA.bodies[0], {
  //   x: (300 - ropeA.bodies[0].position.x) * 0.3,
  //   y: (200 - ropeA.bodies[0].position.y) * 0.3,
  // });
});

// Run the engine
Engine.run(engine);

// Run the renderer
Render.run(render);

// Creates a variable that will hold the current milk object on the screen
let milk;

// Function that will randomly spawn a new milk object on the screen
function spawnMilk() {
  milk = Bodies.rectangle(
    Math.random() * window.innerWidth,
    Math.random() * window.innerHeight,
    50,
    70,
    {
      isStatic: true,
      render: {
        sprite: {
          texture: "./milk.png",
          xScale: 1.5,
          yScale: 1.5,
        },
        // visible: true,
      },
    }
  );

  World.add(world, milk);
}

spawnMilk();

// Checks if theres been a collision between a milk and a yellow cursor
// Runs anytime theres a collision between an object
Events.on(engine, "collisionStart", function (event) {
  var pairs = event.pairs;
  for (var i = 0, j = pairs.length; i != j; ++i) {
    var pair = pairs[i];

    // Checks the pair if its the milk and the yellow cursor body
    if (
      (pair.bodyA === milk) &
      (pair.bodyB === ropeA.bodies[ropeA.bodies.length - 1])
    ) {
      Composite.remove(world, milk);
      spawnMilk();
      addCursor();
      score++;
      scoreElem.innerHTML = score;
    } else if (
      (pair.bodyB === milk) &
      (pair.bodyA === ropeA.bodies[ropeA.bodies.length - 1])
    ) {
      Composite.remove(world, milk);
      spawnMilk();
      addCursor();
      score++;
      scoreElem.innerHTML = score;
    }
  }
});

// function that adds a new yellow cursor and changes
// the appearance of the old one into a bone
function addCursor() {
  // Change the appearance of the last body into a bone
  ropeA.bodies[ropeA.bodies.length - 1].render.sprite.texture = "./bone.png";

  // Add a new yellow cursor to the ropeA composite
  Composite.add(
    ropeA,
    Bodies.rectangle(
      ropeA.bodies[ropeA.bodies.length - 1].position.x,
      ropeA.bodies[ropeA.bodies.length - 1].position.y,
      20,
      40,
      {
        collisionFilter: { group: cursors },
        render: {
          sprite: {
            texture: "./cursor-active.png",
            xScale: 0.1,
            yScale: 0.1,
          },
          visible: true,
        },
      }
    )
  );

  // Create a constraint between the yellow cursor and the last body
  // pointA and pointB are the offsets of where to put the ends of the constraints
  // pointA is the bottom of the last body and pointB is at the top of the new body
  Composite.add(
    ropeA,
    Constraint.create({
      bodyA: ropeA.bodies[ropeA.bodies.length - 2],
      bodyB: ropeA.bodies[ropeA.bodies.length - 1],
      pointA: {
        x: 0,
        y: 20,
      },
      pointB: {
        x: 0,
        y: -20,
      },
      length: 1,
      render: { visible: false },
    })
  );
}

// Hide the instructions after 5 seconds
setTimeout(() => {
  document.querySelector("#instructions").hidden = true;
}, 5000);
