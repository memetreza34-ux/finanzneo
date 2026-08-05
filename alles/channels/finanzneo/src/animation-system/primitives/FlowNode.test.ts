import {describe, expect, it} from 'vitest';
import {resolveFlowNodeLocalFrame} from './FlowNode';

describe('resolveFlowNodeLocalFrame', () => {
  it('waits until the configured start frame', () => {
    expect(resolveFlowNodeLocalFrame(5, 10)).toBe(0);
    expect(resolveFlowNodeLocalFrame(10, 10)).toBe(0);
    expect(resolveFlowNodeLocalFrame(18, 10)).toBe(8);
  });

  it('sanitizes malformed frame inputs', () => {
    expect(resolveFlowNodeLocalFrame(Number.NaN, 10)).toBe(0);
    expect(resolveFlowNodeLocalFrame(12, Number.NaN)).toBe(12);
    expect(resolveFlowNodeLocalFrame(-5, 0)).toBe(0);
  });
});
