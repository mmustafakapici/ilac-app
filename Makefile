# Unit testleri çalıştır
unit-test:
	yarn test unit

# Component testleri çalıştır
component-test:
	yarn test component

# Entegrasyon testleri çalıştır
integration-test:
	yarn test integration

# Tüm jest testlerini çalıştır
jest-test:
	yarn test

# E2E (Maestro) testlerini çalıştır
maestro-test:
	maestro test maestro/flows

# Tüm testleri (jest + maestro) çalıştır
all-test:
	make jest-test && make maestro-test

# Uygulamayı başlat
start:
	yarn start

# Logları göster (örnek: logs/app.log)
logs:
	@echo "Loglar gösteriliyor..."
	@type logs/app.log || echo "Log dosyası bulunamadı."

# Logları temizle
clean-logs:
	@echo "Loglar temizleniyor..."
	@del /Q logs\*.log || echo "Log dosyası bulunamadı."

# Test raporu oluştur (ör: jest-html-reporter ile)
test-report:
	@echo "Test raporu oluşturuluyor..."
	yarn test --coverage --reporters=default --reporters=jest-html-reporter

# Kod kalitesini kontrol et (ör: eslint)
lint:
	@echo "Kod kalitesi kontrol ediliyor..."
	yarn lint

# Build işlemi
build:
	@echo "Build işlemi başlatılıyor..."
	yarn build

# Hepsini çalıştır (örnek)
all:
	make lint && make all-test && make build && make start

.PHONY: start logs clean-logs test-report lint build all 