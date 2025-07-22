/**
 * Simple working test to verify Jest setup
 */

describe('Basic Test Suite', () => {
  test('should verify Jest is working', () => {
    expect(1 + 1).toBe(2);
  });

  test('should verify JavaScript basics', () => {
    const greeting = 'Hello 3 Ball Network!';
    expect(greeting).toContain('3 Ball');
    expect(greeting.length).toBeGreaterThan(10);
  });

  test('should verify async/await works', async () => {
    const promise = Promise.resolve('test completed');
    const result = await promise;
    expect(result).toBe('test completed');
  });

  test('should verify object manipulation', () => {
    const player = {
      name: 'Test Player',
      position: 'Point Guard',
      stats: { points: 25, assists: 8 },
    };

    expect(player.name).toBe('Test Player');
    expect(player.stats.points).toBeGreaterThan(20);
    expect(Object.keys(player)).toContain('position');
  });

  test('should verify array operations', () => {
    const teams = ['Lakers', 'Warriors', 'Bulls'];
    expect(teams).toHaveLength(3);
    expect(teams).toContain('Lakers');
    expect(teams.map(team => team.toLowerCase())).toEqual([
      'lakers',
      'warriors',
      'bulls',
    ]);
  });
});
