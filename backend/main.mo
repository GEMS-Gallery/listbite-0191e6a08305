import Bool "mo:base/Bool";
import Nat "mo:base/Nat";

import Array "mo:base/Array";
import Int "mo:base/Int";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor {
  type Item = {
    id: Nat;
    description: Text;
    completed: Bool;
    timestamp: Time.Time;
  };

  stable var nextId : Nat = 0;
  stable var items : [Item] = [];

  public func addItem(description: Text) : async Nat {
    let id = nextId;
    let newItem : Item = {
      id = id;
      description = description;
      completed = false;
      timestamp = Time.now();
    };
    items := Array.append(items, [newItem]);
    nextId += 1;
    id
  };

  public func removeItem(id: Nat) : async Bool {
    let newItems = Array.filter(items, func (item: Item) : Bool {
      item.id != id
    });
    if (items.size() != newItems.size()) {
      items := newItems;
      true
    } else {
      false
    }
  };

  public query func getItems() : async [Item] {
    items
  };

  public func toggleItemStatus(id: Nat) : async Bool {
    let foundItem = Array.find(items, func (item: Item) : Bool { item.id == id });
    switch (foundItem) {
      case null { false };
      case (?item) {
        let updatedItem = {
          id = item.id;
          description = item.description;
          completed = not item.completed;
          timestamp = item.timestamp;
        };
        items := Array.map(items, func (i: Item) : Item {
          if (i.id == id) { updatedItem } else { i }
        });
        true
      };
    };
  };
}
