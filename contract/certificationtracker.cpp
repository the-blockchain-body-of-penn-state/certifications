#include <eosiolib/eosio.hpp>

using namespace eosio;

class [[eosio::contract("addressbook")]] addressbook : public eosio::contract {
  public:
    using contract::contract;
    addressbook(name receiver, name code,  datastream<const char*> ds): contract(receiver, code, ds) {}

    [[eosio::action]]
    void upsert(name user, double score, std::string date, std::string field) {
      require_auth( user );
      address_index addresses(_code, _code.value);
      auto iterator = addresses.find(user.value);
      if( iterator == addresses.end() ) {
        addresses.emplace(user, [&]( auto& row ) {
         row.key = user;
         row.score = score;
         row.date = date;
         row.field = field;
        });
      } else {
        std::string changes;
        addresses.modify(iterator, user, [&]( auto& row ) {
          row.key = user;
          row.score = score;
          row.date = date;
          row.field = field;
        });
      }
    }

    [[eosio::action]]
    void erase(name user) {
      require_auth(user);
      address_index addresses(_self, _code.value);
      auto iterator = addresses.find(user.value);
      eosio_assert(iterator != addresses.end(), "Record does not exist");
      addresses.erase(iterator);
    }

  private:
    struct [[eosio::table]] certification{
      name key;
      double score;
      std::string date;
      std::string field;
      uint64_t primary_key() const { return key.value; }
    };
    typedef eosio::multi_index<"certification"_n, certification> address_index;
};

EOSIO_DISPATCH( addressbook, (upsert)(erase))
