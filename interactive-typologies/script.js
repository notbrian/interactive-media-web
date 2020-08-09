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
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Vector = Matter.Vector;

// create an engine
var engine = Engine.create();

var world = engine.world;

const canvas = document.querySelector("canvas");

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

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// add bodies
var cursors = Body.nextGroup(false);

var ropeA = Composites.stack(window.innerWidth / 2, 100, 1, 1, 0, 0, function (
  x,
  y
) {
  return Bodies.rectangle(x, y, 40, 20, {
    collisionFilter: { group: cursors },
    render: {
      sprite: {
        texture: "./cursor-active.png",
        xScale: 0.1,
        yScale: 0.1,
      },
    },
  });
});

Composites.chain(ropeA, 0.5, 0, -0.5, 0, {
  length: 0,
  render: { visible: false },
});

World.add(world, ropeA);

var mouse = Mouse.create(render.canvas);

Events.on(engine, "afterUpdate", function () {
  Body.setVelocity(ropeA.bodies[0], {
    x: (mouse.position.x - ropeA.bodies[0].position.x) * 0.3,
    y: (mouse.position.y - ropeA.bodies[0].position.y) * 0.3,
  });
});
// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);
let food;

function spawnFood() {
  food = Bodies.rectangle(
    Math.random() * window.innerWidth,
    Math.random() * window.innerHeight,
    40,
    40,
    {
      isStatic: true,
      render: {
        fillStyle: "#ffea00",
      },
    }
  );

  World.add(world, food);
}

spawnFood();

let score = 1;
const scoreElem = document.querySelector("#score");

Events.on(engine, "collisionStart", function (event) {
  var pairs = event.pairs;
  for (var i = 0, j = pairs.length; i != j; ++i) {
    var pair = pairs[i];

    if (
      (pair.bodyA === food) &
      (pair.bodyB === ropeA.bodies[ropeA.bodies.length - 1])
    ) {
      Composite.remove(world, food);
      spawnFood();
      addCursor();
      score++;
      scoreElem.innerHTML = score;
    } else if (
      (pair.bodyB === food) &
      (pair.bodyA === ropeA.bodies[ropeA.bodies.length - 1])
    ) {
      Composite.remove(world, food);
      spawnFood();
      addCursor();
      score++;
      scoreElem.innerHTML = score;
    }
  }
});

function addCursor() {
  ropeA.bodies[ropeA.bodies.length - 1].render.sprite.texture = "./cursor.png";
  Composite.add(
    ropeA,
    Bodies.rectangle(
      ropeA.bodies[ropeA.bodies.length - 1].position.x + 30,
      ropeA.bodies[ropeA.bodies.length - 1].position.y + 30,
      40,
      20,
      {
        collisionFilter: { group: cursors },
        render: {
          sprite: {
            texture: "./cursor-active.png",
            xScale: 0.1,
            yScale: 0.1,
          },
        },
      }
    )
  );

  Composite.add(
    ropeA,
    Constraint.create({
      bodyA: ropeA.bodies[ropeA.bodies.length - 2],
      bodyB: ropeA.bodies[ropeA.bodies.length - 1],
      pointA: {
        x: 20,
        y: 0,
      },
      pointB: {
        x: -20,
        y: 0,
      },
      length: 0,

      render: { visible: false },
    })
  );
}

setTimeout(() => {
  document.querySelector("#instructions").hidden = true;
}, 5000);
