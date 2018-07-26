export class SimpleActor {
  name;
  args: any[];
  isAlive = true;
  pool = _pool;

  constructor(public updateFunc: Function = null, ...args) {
    if (this.updateFunc != null) {
      this.name = updateFunc.name;
    }
    this.args = args;
    this.pool.add(this);
  }

  update() {
    if (this.updateFunc != null) {
      this.updateFunc(this, ...this.args);
    }
  }

  remove() {
    if (!this.isAlive) {
      return false;
    }
    this.isAlive = false;
    return true;
  }
}

export class SimpleActorPool {
  actors: SimpleActor[] = [];

  add(actor: SimpleActor) {
    this.actors.push(actor);
  }

  update() {
    for (let i = 0; i < this.actors.length; ) {
      const actor = this.actors[i];
      if (actor.isAlive) {
        actor.update();
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
  }
}

export let _pool = new SimpleActorPool();
