#include <eosiolib/eosio.hpp>

using namespace eosio;

class [[eosio::contract("certificationtracker")]] certificationtracker : public eosio::contract {
  public:
    using contract::contract;
    addressbook(name receiver, name code,  datastream<const char*> ds): contract(receiver, code, ds) {}

    [[eosio::action]]
    void upsert(name user, std::string first_name, std::string last_name, std::string street, std::string city, std::string state) {
      require_auth( user );
      address_index certifications(_code, _code.value);
      auto iterator = certifications.find(user.value);
      if( iterator == certifications.end() ) {
        certifications.emplace(user, [&]( auto& row ) {
         row.key = user;
         row.first_name = first_name;
         row.last_name = last_name;
         row.street = street;
         row.city = city;
         row.state = state;
        });
      } else {
        std::string changes;
        certifications.modify(iterator, user, [&]( auto& row ) {
          row.key = user;
          row.first_name = first_name;
          row.last_name = last_name;
          row.street = street;
          row.city = city;
          row.state = state;
        });
      }
    }

    [[eosio::action]]
    void erase(name user) {
      require_auth(user);
      address_index certifications(_self, _code.value);
      auto iterator = addresses.find(user.value);
      eosio_assert(iterator != addresses.end(), "Record does not exist");
      addressbook.cpp.erase(iterator);
    }

  private:
    struct [[eosio::table]] certification {
      name key;
      std::string first_name;
      std::string last_name;
      std::string street;
      std::string city;
      std::string state;
      uint64_t primary_key() const { return key.value; }
    };
    typedef eosio::multi_index<"record"_n, certification> certification_index;
};

EOSIO_DISPATCH( certifications, (upsert)(erase))
