const mockACL = {
  defaultValue: [],
  redOnly:      [
    {
      agent: 'https://yodata.io/app/real-estate-digital',
      mode:  ['Read', 'Append']
    }
  ],
  saOnly:       [
    {
      agent: 'https://yodata.io/app/real-estate-digital',
      mode:  []
    },
    {
      agent: 'https://yodata.io/app/smarter-agent',
      mode:  ['Read', 'Append']
    }
  ],
  bothAllowed:  [
    {
      agent: 'https://yodata.io/app/real-estate-digital',
      mode:  ['Read', 'Append']
    },
    {
      agent: 'https://yodata.io/app/smarter-agent',
      mode:  ['Read', 'Append']
    }
  ],
  bothRejected: [
    {
      agent: 'https://yodata.io/app/real-estate-digital',
      mode:  []
    },
    {
      agent: 'https://yodata.io/app/smarter-agent',
      mode:  []
    }
  ]
};
const RED = 'real-estate-digital';
const SA = 'smarter-agent';

const aclIndex = jest.fn(function(acls = []) {
  const defaultResult = {
    'real-estate-digital': true,
    'smarter-agent':       true
  };
  return acls.reduce(function(result, acl){
    let {agent = '', mode = ['Read', 'Append']} = acl;
    let agentName = agent.replace('https://yodata.io/app/', '');
    result[agentName] = (mode.includes('Read') && mode.includes('Append'));
    return result
  }, defaultResult);
});

describe('ACL TESTS', function() {
  test('on by default', function() {
    expect(aclIndex(mockACL.defaultValue)).toMatchObject({
      [RED]: true,
      [SA]:  true
    })
  });

  test('red on, sa default', function() {
    expect(aclIndex(mockACL.redOnly)).toMatchObject({
      [RED]: true,
      [SA]:  true
    })
  });

  test('sa on, red off', function() {
    expect(aclIndex(mockACL.saOnly)).toMatchObject({
      [RED]: false,
      [SA]:  true
    })
  });

  test('both on', function() {
    expect(aclIndex(mockACL.bothAllowed)).toMatchObject({
      [RED]: true,
      [SA]:  true
    })
  });

  test('both off', function() {
    expect(aclIndex(mockACL.bothRejected)).toMatchObject({
      [RED]: false,
      [SA]:  false
    })
  })

  test('undefined', function() {
    expect(aclIndex()).toMatchObject({
      [RED]: true,
      [SA]: true
    })
  })
});



