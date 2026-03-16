# Gem Tower Defense

Gem Tower Defense to gra typu Tower Defense uruchamiana bezposrednio w przegladarce.
Budujesz magiczne wieze z klejnotow, bronisz bazy i przechodzisz kolejne fale przeciwnikow.

## Na czym polega gra

Cel: przetrwac wszystkie fale i nie dopuscic do zniszczenia bazy.

Petla rozgrywki:
1. Wybierasz i stawiasz wieze na wolnych polach.
2. Uruchamiasz fale przeciwnikow.
3. Wieze atakuja automatycznie wrogow idacych po trasie.
4. Za pokonanych przeciwnikow dostajesz gold.
5. Ulepszasz wieze albo sprzedajesz je i zmieniasz strategie.
6. Powtarzasz do finalnej fali z bossem.

## Wieze

### Emerald (Szmaragd)
- Rola: poison / damage over time
- Mocne strony: dobra kontra na szybkie jednostki
- Cechy: zatrucie, sredni zasieg

### Ruby (Rubin)
- Rola: splash damage
- Mocne strony: czyszczenie grup przeciwnikow
- Cechy: obrazenia obszarowe (AoE), wysoki burst

### Diamond (Diament)
- Rola: sniper tower
- Mocne strony: tanki i bossowie
- Cechy: crit, armor pierce, dlugi zasieg

### Amethyst (Ametyst)
- Rola: chain lightning
- Mocne strony: przeskakiwanie miedzy celami
- Cechy: lancuchowe trafienia, obrazenia maleja na kolejnych celach

### Topaz
- Rola: support slow tower
- Mocne strony: kontrola tempa przeciwnikow
- Cechy: spowolnienie + obrazenia

## Przeciwnicy

- Basic: standardowy przeciwnik
- Fast: szybki, nizsza wytrzymalosc
- Tank: wolny, wysoka wytrzymalosc i pancerz
- Boss: najmocniejszy przeciwnik finalnej fali

## Sterowanie i UI

- `Spacja` - start kolejnej fali
- `1 / 2 / 3` - tempo gry (`x1`, `x2`, `x3`)
- `ESC` - anuluj tryb budowy
- Klik na wieze - wybor wiezy
- Przyciski UI:
  - `Start fali`
  - `Auto fale` (wlacz/wyłącz automatyczne uruchamianie kolejnych fal)
  - `Ulepsz` / `Sprzedaj`

## Uruchomienie

Gra nie wymaga frameworkow ani build tooli.

Wystarczy:
1. Otworzyc plik `index.html` w przegladarce.
2. Kliknac `Start gry`.

## Stack techniczny

- HTML5
- CSS3
- Vanilla JavaScript
- Canvas API

