# Test Komutları ve Açıklamaları

Bu dokümantasyon, projemizde kullanılan test komutlarını ve her birinin ne işe yaradığını açıklamaktadır.

## Temel Test Komutları

### Tüm Testleri Çalıştırma

```bash
yarn test
```

- Tüm test dosyalarını çalıştırır
- Jest'in varsayılan yapılandırmasını kullanır
- Test sonuçlarını konsola yazdırır

### İzleme Modunda Test

```bash
yarn test:watch
```

- Testleri izleme modunda çalıştırır
- Dosya değişikliklerini otomatik algılar
- Değişiklik olduğunda ilgili testleri otomatik çalıştırır
- Etkileşimli modda çalışır (test seçimi, filtreleme vb.)

### Coverage Raporu

```bash
yarn test:coverage
```

- Tüm testleri çalıştırır ve coverage raporu oluşturur
- Minimum coverage gereksinimleri:
  - Branches: %80
  - Functions: %80
  - Lines: %80
  - Statements: %80
- HTML ve konsol raporları oluşturur

## Kategori Bazlı Testler

### Bileşen Testleri

```bash
yarn test:components
```

- Sadece `_tests_/component` dizinindeki testleri çalıştırır
- Test edilen özellikler:
  - Render doğruluğu
  - Props validasyonu
  - Event handler'lar
  - State değişimleri
  - UI elementlerinin görünürlüğü
  - Kullanıcı etkileşimleri

### Entegrasyon Testleri

```bash
yarn test:integration
```

- Sadece `_tests_/integration` dizinindeki testleri çalıştırır
- Test edilen özellikler:
  - Ekranlar arası geçişler
  - Navigation stack
  - Modal açılıp kapanmaları
  - Form işlemleri
  - API entegrasyonları
  - Veri akışı

### Store Testleri

```bash
yarn test:store
```

- Sadece `_tests_/store` dizinindeki testleri çalıştırır
- Test edilen özellikler:
  - State güncellemeleri
  - Action'ların çalışması
  - Selector'ların doğruluğu
  - Async işlemler
  - Error handling

### Unit Testler

```bash
yarn test:unit
```

- Sadece `_tests_/unit` dizinindeki testleri çalıştırır
- Test edilen özellikler:
  - Utility fonksiyonları
  - Helper metodlar
  - Pure fonksiyonlar
  - Hesaplamalar
  - Validasyonlar

## Özel Durum Testleri

### CI/CD Testleri

```bash
yarn test:ci
```

- CI/CD ortamı için optimize edilmiş testler
- Coverage raporu oluşturur
- Maksimum 2 worker kullanır
- Non-interactive modda çalışır

### Snapshot Güncelleme

```bash
yarn test:update
```

- Snapshot testlerini günceller
- `-u` veya `--updateSnapshot` flag'ini kullanır
- Mevcut snapshot'ları yeni test sonuçlarıyla değiştirir

### Önbellek Temizleme

```bash
yarn test:clear
```

- Jest önbelleğini temizler
- `--clearCache` flag'ini kullanır
- Test çalıştırma sorunlarını çözmek için kullanılır

### Hata Ayıklama

```bash
yarn test:debug
```

- Hata ayıklama modunda testleri çalıştırır
- `--runInBand` flag'i ile testleri sıralı çalıştırır
- `--detectOpenHandles` flag'i ile açık kalan işlemleri tespit eder

## Test Yapılandırması

### Jest Konfigürasyonu

- `jest.config.js` dosyasında tanımlanmıştır
- React Native ve TypeScript desteği
- Coverage raporlama ayarları
- Transform ve module mapper ayarları
- Test ortamı ayarları

### Test Setup

- `jest.setup.js` dosyasında tanımlanmıştır
- React Native modüllerinin mock'ları
- Navigation mock'ları
- Platform API mock'ları
- Global değişken mock'ları

## Kullanım Önerileri

1. **Geliştirme Sırasında**:

   ```bash
   yarn test:watch
   ```

2. **CI/CD Pipeline'ında**:

   ```bash
   yarn test:ci
   ```

3. **Coverage Raporu İçin**:

   ```bash
   yarn test:coverage
   ```

4. **Belirli Bir Kategori İçin**:

   ```bash
   yarn test:components  # veya diğer kategoriler
   ```

5. **Hata Ayıklama İçin**:
   ```bash
   yarn test:debug
   ```

## Notlar

- Tüm testler TypeScript ile yazılmıştır
- React Native Testing Library kullanılmaktadır
- Jest Native eklentisi ile native özellikler test edilebilir
- Coverage raporları `coverage` dizininde oluşturulur
- Test dosyaları `_tests_` dizininde organize edilmiştir

## Hızlı Komut Referansı

### Temel Test Komutları

| Komut                | Açıklama                                                             |
| -------------------- | -------------------------------------------------------------------- |
| `yarn test`          | Tüm testleri çalıştırır                                              |
| `yarn test:watch`    | Testleri izleme modunda çalıştırır (değişiklikleri otomatik algılar) |
| `yarn test:coverage` | Test coverage raporu oluşturur                                       |

### Kategori Bazlı Test Komutları

| Komut                   | Açıklama                                 |
| ----------------------- | ---------------------------------------- |
| `yarn test:components`  | Sadece bileşen testlerini çalıştırır     |
| `yarn test:integration` | Sadece entegrasyon testlerini çalıştırır |
| `yarn test:store`       | Sadece store testlerini çalıştırır       |
| `yarn test:unit`        | Sadece unit testleri çalıştırır          |

### Özel Durum Test Komutları

| Komut              | Açıklama                                   |
| ------------------ | ------------------------------------------ |
| `yarn test:ci`     | CI/CD ortamı için optimize edilmiş testler |
| `yarn test:update` | Snapshot testlerini günceller              |
| `yarn test:clear`  | Jest önbelleğini temizler                  |
| `yarn test:debug`  | Hata ayıklama modunda testleri çalıştırır  |

> **Not**: Her komutun detaylı açıklaması için yukarıdaki ilgili bölümlere bakabilirsiniz.
