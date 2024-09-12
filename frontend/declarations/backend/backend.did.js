export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const Item = IDL.Record({
    'id' : IDL.Nat,
    'completed' : IDL.Bool,
    'description' : IDL.Text,
    'timestamp' : Time,
  });
  return IDL.Service({
    'addItem' : IDL.Func([IDL.Text], [IDL.Nat], []),
    'getItems' : IDL.Func([], [IDL.Vec(Item)], ['query']),
    'removeItem' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'toggleItemStatus' : IDL.Func([IDL.Nat], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
