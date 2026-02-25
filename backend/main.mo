import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";

actor {
  type Account = {
    paymentPin : Text;
    balance : Nat;
  };

  let accounts = Map.empty<Principal, Account>();

  public shared ({ caller }) func registerUser(paymentPin : Text) : async () {
    switch (accounts.get(caller)) {
      case (null) {
        accounts.add(caller, { paymentPin; balance = 0 });
      };
      case (?_) {
        Runtime.trap("User already registered");
      };
    };
  };

  public shared ({ caller }) func updatePin(newPin : Text) : async () {
    switch (accounts.get(caller)) {
      case (null) {
        Runtime.trap("User not found");
      };
      case (?account) {
        accounts.add(caller, { account with paymentPin = newPin });
      };
    };
  };

  public shared ({ caller }) func updateBalance(amount : Nat) : async () {
    switch (accounts.get(caller)) {
      case (null) {
        Runtime.trap("User not found");
      };
      case (?account) {
        accounts.add(caller, { account with balance = amount });
      };
    };
  };

  public query ({ caller }) func getBalance() : async Nat {
    switch (accounts.get(caller)) {
      case (null) {
        Runtime.trap("User not found");
      };
      case (?account) { account.balance };
    };
  };
};
