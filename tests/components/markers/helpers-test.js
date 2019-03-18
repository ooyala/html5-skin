import { getPosition, getSize } from "../../../js/components/markers/helpers";

describe('getPosition helper', function(){
  it('Should return zero when there is no duration or width', function(){
    expect(getPosition(0, 0, 100)).toBe(0);
    expect(getPosition(10, 0, 100)).toBe(0);
    expect(getPosition(0, 10, 100)).toBe(0);
  });

  it('Should return zero when there is no init data', function(){
    expect(getPosition(0, 0, 0)).toBe(0);
    expect(getPosition(10, 0, 0)).toBe(0);
    expect(getPosition(0, 10, 0)).toBe(0);
  });

  it('Should return the position in pixels for the given duration and width ', function(){
    expect(getPosition(300, 800, 60)).toBe(160);
    expect(getPosition(350, 800, 150)).toBeCloseTo(342.857);
    expect(getPosition(300, 900, 225)).toBe(675);
    expect(getPosition(300, 800, 300)).toBe(800);
  });
});

describe('getSize helper', function(){
  it('Should return zero when there is no duration or width', function(){
    expect(getSize(0, 0, 60, 150)).toBe(0);
  });

  it('Should return the size in pixels for the given params', function(){
    expect(getSize(300, 800, 60)).toBeCloseTo(5.33);
    expect(getSize(300, 800, 60, 62)).toBeCloseTo(5.33);
    expect(getSize(300, 800, 60, 70)).toBeCloseTo(26.666);
  });
});