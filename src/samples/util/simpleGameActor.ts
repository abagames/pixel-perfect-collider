export class Actor {
  name;
  args: any[];
  isAlive = true;
  ticks = 0;
  isSpawning = true;
  pool = pool;
  onRemove: Function;

  constructor(public updateFunc: Function = null, ...args) {
    if (this.updateFunc != null) {
      this.name = updateFunc.name;
    }
    this.args = args;
    if (args != null && args.length > 0) {
      let lastArg = args[args.length - 1];
      if (lastArg instanceof Pool) {
        this.pool = lastArg;
      }
    }
    this.pool.add(this);
  }

  update() {
    if (this.updateFunc != null) {
      this.updateFunc(this, ...this.args);
    }
    this.ticks++;
    this.isSpawning = false;
  }

  remove() {
    if (!this.isAlive) {
      return;
    }
    if (this.onRemove != null) {
      this.onRemove();
    }
    this.isAlive = false;
  }
}

export class Pool {
  actors: Actor[] = [];
  isRemoving = false;

  add(actor: Actor) {
    this.actors.push(actor);
  }

  update() {
    for (let i = 0; i < this.actors.length; ) {
      const actor = this.actors[i];
      if (actor.isAlive) {
        actor.update();
      }
      if (this.isRemoving) {
        this.isRemoving = false;
        break;
      }
      if (!actor.isAlive) {
        this.actors.splice(i, 1);
      } else {
        i++;
      }
    }
  }

  get(name: string = null) {
    return name == null
      ? this.actors
      : this.actors.filter(a => a.name === name);
  }

  removeAll() {
    this.actors.forEach(a => {
      a.remove();
    });
    this.actors = [];
    this.isRemoving = true;
  }
}

export let pool = new Pool();
