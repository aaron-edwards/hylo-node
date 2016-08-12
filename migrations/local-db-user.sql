create user hylolocal password 'hylolocalpassword';
GRANT ALL PRIVILEGES ON DATABASE hylo TO hylolocal;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO hylolocal;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO hylolocal;
ALTER DEFAULT PRIVILEGES FOR USER hylolocal IN SCHEMA public
  GRANT ALL PRIVILEGES ON TABLES TO hylolocal;
ALTER DEFAULT PRIVILEGES FOR USER hylolocal IN SCHEMA public
  GRANT ALL PRIVILEGES ON SEQUENCES TO hylolocal;
ALTER SCHEMA public OWNER TO hylolocal;
