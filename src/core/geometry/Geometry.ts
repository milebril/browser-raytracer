import Color3 from '../../utils/Color3';
import Ray from '../Ray';

abstract class Geometry {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  abstract hit(_ray: Ray): boolean;
  abstract getColor(_ray: Ray): Color3;
}

export default Geometry;
