const width = 600
const height = 600

function setup() {
  createCanvas(width, height)

  grid = new HexGrid(width, height, 20)
}

function draw() {
  background(50)
  grid.show()
}

function mousePressed() {
  grid.clear_all()

  let hex = grid.coords_to_hex(mouseX, mouseY)

  hex.selected ^= true

  let neighbors = grid.get_neighbors(hex)

  for (let n of neighbors) {
    n.is_neighbor = true
  }
}

class HexGrid {
  constructor(width, height, radius) {
    // Store locals
    this.width = width
    this.height = height
    this.radius = radius
    this.short_radius = this.radius * sin(PI / 3)

    // This is the hexes in the x axis tip to tip
    this.width_in_hexes = int(this.width / (2 * this.radius))
    // This is the
    this.height_in_hexes = int(this.height / (1 * this.short_radius))

    // Make centers
    this.centers = new Array(this.width_in_hexes)
    for (var i = 0; i < this.width_in_hexes; i++) {

      this.centers[i] = new Array(this.height_in_hexes)

      for (var j = 0; j < this.height_in_hexes; j++) {
        let _i = i - 10
        let x = (this.radius * 3 * _i) + ((j) * 1.5 * this.radius)
        let y = this.short_radius * j

        this.centers[i][j] = { x, y }
      }
    }

    // Make Hexes
    this.hexes = new Array(this.width_in_hexes)
    for (var i = 0; i < this.width_in_hexes; i++) {

      this.hexes[i] = new Array(this.height_in_hexes)

      for (var j = 0; j < this.height_in_hexes; j++) {
        let { x, y } = this.centers[i][j]

        this.hexes[i][j] = new Hexagon(i, j, x, y, this.radius)
      }
    }

  }

  show() {
    for (var i = 0; i < this.width_in_hexes; i++) {
      for (var j = 0; j < this.height_in_hexes; j++) {
        let hex = this.hexes[i][j]
        hex.show()
      }
    }
  }

  coords_to_hex(x, y) {
    let dist = (x1, y1, x2, y2) => sqrt(pow((x2 - x1), 2) + pow((y2 - y1), 2))

    let min_hex = this.hexes[0][0]
    let min_dist = dist(x, y, min_hex.x, min_hex.y)

    for (var i = 0; i < this.width_in_hexes; i++) {
      for (var j = 0; j < this.height_in_hexes; j++) {
        let new_hex = this.hexes[i][j]

        let new_dist = dist(x, y, new_hex.x, new_hex.y)

        if (min_dist > new_dist) {
          min_dist = new_dist
          min_hex = new_hex
        }
      }
    }
    return min_hex;
  }

  clear_all() {
    for (var i = 0; i < this.width_in_hexes; i++) {
      for (var j = 0; j < this.height_in_hexes; j++) {
        let new_hex = this.hexes[i][j]
        new_hex.selected = false
        new_hex.is_neighbor = false
      }
    }
  }

  get_neighbors(hex) {
    let i = hex.i
    let j = hex.j

    let neighbors = []

    // east
    neighbors.push(this.hexes[i - 1][j + 1])
    neighbors.push(this.hexes[i - 1][j + 2])
    // west
    neighbors.push(this.hexes[i + 1][j - 1])
    neighbors.push(this.hexes[i + 1][j - 2])

    // north
    neighbors.push(this.hexes[i][j + 1])
    // south
    neighbors.push(this.hexes[i][j - 1])

    return neighbors
  }
}

class Polygon {
  constructor(i, j, x, y, r, sides) {
    // Length to vertexes
    this.r = r
    // GridCoords
    this.i = i
    this.j = j
    // center of polygon
    this.x = x
    this.y = y
    this.sides = sides
  }

  show(rotation = 0) {
    const arc_width = (2 * PI) / this.sides

    push()


    translate(this.x, this.y);
    rotate(rotation)

    beginShape()
    for (var i = 0; i < this.sides; i++) {
      const angle = arc_width * i;
      const x = (cos(angle) * this.r)
      const y = (sin(angle) * this.r)

      vertex(x, y)
    }
    endShape(CLOSE)


    pop()
  }
}

class Hexagon extends Polygon {
  constructor(i, j, x, y, r) {
    super(i, j, x, y, r, 6)
    this.selected = false
    this.is_neighbor = false
  }

  show(rotation = 0) {
    push()

    if (this.selected) {
      fill(100, 0, 0)
    } else if (this.is_neighbor) {
      fill(0, 100, 0)
    } else {
      fill(200)
    }


    super.show(rotation)

    fill(0)
    text(`${this.i},${this.j}`, this.x - (this.r / 2), this.y)

    pop()
  }
}

