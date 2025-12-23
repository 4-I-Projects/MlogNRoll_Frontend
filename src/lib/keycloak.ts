// src/lib/keycloak.ts
import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: 'http://localhost:8080', 
  realm: 'mlog',         // [QUAN TRỌNG] Phải khớp tên Realm bạn tạo (chữ thường)
  clientId: 'mlog-app',  // [QUAN TRỌNG] Phải khớp Client ID bạn tạo
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;