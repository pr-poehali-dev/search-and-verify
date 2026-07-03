import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

const DIRECTIONS = [
  {
    icon: 'ShieldAlert',
    tag: 'Проверка',
    title: 'Пробив человека',
    text: 'Проверим номер, профиль, карту или имя по базе жалоб и заявок. Узнаете, светился ли контакт в мошеннических схемах.',
    cta: 'Проверить контакт',
    target: 'probe',
  },
  {
    icon: 'Search',
    tag: 'Розыск',
    title: 'Помощь в поиске',
    text: 'Подача заявки на розыск пропавших, пленных, раненых и погибших. Собираем данные и подключаем проверенных волонтёров.',
    cta: 'Подать заявку на поиск',
    target: 'search',
  },
  {
    icon: 'HeartHandshake',
    tag: 'Поддержка',
    title: 'Сопровождение до конца',
    text: 'Подскажем, куда обратиться, какие документы и выплаты положены. Ведём семью на всех этапах — без брошенных на полпути.',
    cta: 'Получить сопровождение',
    target: 'support',
  },
];

const REASONS = [
  'Угрожает',
  'Просит деньги',
  'Торопит с оплатой',
  'Использует слово «груз»',
  'Подозрительный профиль',
  'Представился волонтёром без подтверждения',
  'Скидывает фото документов',
  'Уже перевели деньги',
];

const STOP_LIST = [
  { name: 'Аноним «Волонтёр 200»', phone: '+7 900 111-22-33', link: 'vk.com/id000000', card: '2200 •••• 4417', scheme: 'Предоплата за «поиск», исчез', date: '12.06.2026', status: 'Мошенник' },
  { name: 'Ольга П.', phone: '+7 921 555-00-11', link: 'vk.com/fake_help', card: '4276 •••• 9812', scheme: 'Просила деньги на «выкуп из плена»', date: '03.06.2026', status: 'Мошенник' },
  { name: '«Фонд Надежда»', phone: '+7 999 333-77-88', link: 't.me/nadezhda_fond', card: '5536 •••• 1200', scheme: 'Сбор средств от лица несуществующего фонда', date: '28.05.2026', status: 'Под вопросом' },
];

function detectType(v: string): string {
  const s = v.trim();
  if (!s) return '';
  if (/^(https?:\/\/)?(vk\.com|t\.me|telegram)/i.test(s)) return 'Ссылка на профиль';
  if (/^\+?[\d\s()-]{7,}$/.test(s) && s.replace(/\D/g, '').length >= 7 && s.replace(/\D/g, '').length <= 12) return 'Номер телефона';
  if (/^\d[\d\s]{13,18}$/.test(s)) return 'Номер карты';
  return 'Имя / ФИО';
}

const Index = () => {
  const [probeValue, setProbeValue] = useState('');
  const [reasons, setReasons] = useState<string[]>([]);
  const [stopSearch, setStopSearch] = useState('');
  const detected = detectType(probeValue);

  const toggleReason = (r: string) =>
    setReasons((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const filteredStop = STOP_LIST.filter((row) => {
    const q = stopSearch.toLowerCase().trim();
    if (!q) return true;
    return [row.name, row.phone, row.link, row.card].some((f) => f.toLowerCase().includes(q));
  });

  return (
    <div className="min-h-screen font-body text-foreground">
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Icon name="Radar" size={20} />
            </div>
            <div className="leading-tight">
              <p className="font-display text-base font-600 tracking-wide">НАЙТИ · ПРОВЕРИТЬ · ПОМОЧЬ</p>
              <p className="text-[11px] text-muted-foreground">Помощь в зоне СВО</p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <button onClick={() => scrollTo('probe')} className="hover:text-foreground transition-colors">Пробив</button>
            <button onClick={() => scrollTo('search')} className="hover:text-foreground transition-colors">Поиск</button>
            <button onClick={() => scrollTo('stop')} className="hover:text-foreground transition-colors">Стоп-лист</button>
          </nav>
          <Button size="sm" onClick={() => scrollTo('volunteer')} className="hidden sm:inline-flex">
            <Icon name="UserPlus" size={16} className="mr-1.5" /> Стать волонтёром
          </Button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="container grid gap-10 py-16 md:grid-cols-[1.3fr_1fr] md:py-24">
          <div className="fade-up">
            <Badge variant="outline" className="mb-5 border-destructive/40 text-destructive">
              <Icon name="TriangleAlert" size={13} className="mr-1.5" />
              Мошенники наживаются на горе — проверяйте контакты
            </Badge>
            <h1 className="font-display text-4xl font-700 leading-[1.05] sm:text-5xl md:text-6xl">
              Ищем своих.<br />
              <span className="text-primary">Защищаем от мошенников.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Единая точка входа для подачи заявок на поиск пропавших, пленных, погибших
              и раненых в зоне СВО — и для проверки тех, кто предлагает «помощь» за деньги.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={() => scrollTo('probe')}>
                <Icon name="ShieldAlert" size={18} className="mr-2" /> Проверить контакт
              </Button>
              <Button size="lg" variant="secondary" onClick={() => scrollTo('search')}>
                <Icon name="Search" size={18} className="mr-2" /> Подать заявку на поиск
              </Button>
              <Button size="lg" variant="outline" onClick={() => scrollTo('stop')}>
                Стоп-лист мошенников
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <a href="tel:89518125229" className="flex items-center gap-2 hover:text-foreground transition-colors">
                <Icon name="Phone" size={15} /> 8 951 812-52-29
              </a>
              <a href="https://vk.com/id1117400900" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-foreground transition-colors">
                <Icon name="ExternalLink" size={15} /> vk.com/id1117400900
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 self-center fade-up">
            {[
              { n: '3 200+', l: 'проверок контактов' },
              { n: '740', l: 'заявок на поиск' },
              { n: '128', l: 'в стоп-листе' },
              { n: '54', l: 'проверенных волонтёра' },
            ].map((s) => (
              <div key={s.l} className="rounded-lg border border-border bg-card/60 p-5">
                <p className="font-display text-3xl font-700 text-primary">{s.n}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIRECTIONS */}
      <section className="container py-16 md:py-20">
        <div className="mb-10 text-center">
          <p className="font-display text-sm uppercase tracking-[0.2em] text-primary">Три направления</p>
          <h2 className="mt-2 font-display text-3xl font-600 md:text-4xl">С чем мы помогаем</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {DIRECTIONS.map((d) => (
            <div key={d.title} className="group flex flex-col rounded-xl border border-border bg-card/60 p-7 hover-scale">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon name={d.icon} size={24} />
              </div>
              <Badge variant="secondary" className="mb-3 w-fit text-[11px]">{d.tag}</Badge>
              <h3 className="font-display text-2xl font-600">{d.title}</h3>
              <p className="mt-3 flex-1 text-sm text-muted-foreground">{d.text}</p>
              <Button variant="ghost" className="mt-5 justify-start px-0 text-primary hover:text-primary" onClick={() => scrollTo(d.target)}>
                {d.cta} <Icon name="ArrowRight" size={16} className="ml-1.5" />
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* PROBE FORM */}
      <section id="probe" className="border-y border-border/60 bg-card/30">
        <div className="container grid gap-10 py-16 md:grid-cols-[1fr_1.1fr] md:py-20">
          <div>
            <Badge variant="outline" className="mb-4 border-primary/40 text-primary">Проверка контакта</Badge>
            <h2 className="font-display text-3xl font-600 md:text-4xl">Пробив человека</h2>
            <p className="mt-4 text-muted-foreground">
              Введите телефон, ссылку на профиль, номер карты или имя — система сама
              определит тип данных и проверит по всем базам сразу.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {['Проверка по стоп-листу мошенников', 'Совпадения в других заявках', 'Количество жалоб на контакт'].map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-muted-foreground">
                  <Icon name="CircleCheck" size={17} className="text-primary" /> {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-background/70 p-6 md:p-8">
            <label className="text-sm font-500">Данные подозрительного контакта</label>
            <div className="relative mt-2">
              <Input
                value={probeValue}
                onChange={(e) => setProbeValue(e.target.value)}
                placeholder="Телефон, ссылка ВК/Telegram, карта или ФИО"
                className="h-12 pr-32"
              />
              {detected && (
                <Badge className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary/15 text-primary hover:bg-primary/15">
                  {detected}
                </Badge>
              )}
            </div>

            <p className="mt-6 text-sm font-500">Что вызывает подозрение?</p>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {REASONS.map((r) => (
                <label key={r} className="flex cursor-pointer items-start gap-2.5 text-sm text-muted-foreground">
                  <Checkbox checked={reasons.includes(r)} onCheckedChange={() => toggleReason(r)} className="mt-0.5" />
                  {r}
                </label>
              ))}
            </div>

            <Textarea placeholder="Другое — опишите ситуацию" className="mt-4 min-h-[70px]" />
            <Input placeholder="Ваш контакт для обратной связи" className="mt-3 h-11" />

            <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-xs text-muted-foreground">
              <Checkbox className="mt-0.5" /> Согласен на обработку персональных данных
            </label>

            <Button className="mt-5 h-12 w-full text-base">
              <Icon name="ShieldAlert" size={18} className="mr-2" /> Подать заявку на пробив
            </Button>
          </div>
        </div>
      </section>

      {/* SEARCH / SUPPORT teaser */}
      <section className="container grid gap-5 py-16 md:grid-cols-2 md:py-20">
        <div id="search" className="rounded-xl border border-border bg-card/60 p-8">
          <Icon name="Search" size={28} className="text-primary" />
          <h3 className="mt-4 font-display text-2xl font-600">Помощь в поиске</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Заполните данные волонтёра, заявителя и разыскиваемого: ФИО, позывной,
            номер жетона, часть, обстоятельства, приметы, фото. Подключаем розыск.
          </p>
          <Button variant="secondary" className="mt-5">Заполнить заявку на поиск</Button>
        </div>
        <div id="support" className="rounded-xl border border-border bg-card/60 p-8">
          <Icon name="HeartHandshake" size={28} className="text-primary" />
          <h3 className="mt-4 font-display text-2xl font-600">Помощь и сопровождение</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Разовая консультация или ведение до конца. Подсказываем по документам и
            выплатам. Важно: это не юридическая помощь — мы только направляем.
          </p>
          <Button variant="secondary" className="mt-5">Получить сопровождение</Button>
        </div>
      </section>

      {/* STOP LIST */}
      <section id="stop" className="border-y border-border/60 bg-card/30">
        <div className="container py-16 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Badge variant="outline" className="mb-3 border-destructive/40 text-destructive">Публичный список</Badge>
              <h2 className="font-display text-3xl font-600 md:text-4xl">Стоп-лист мошенников</h2>
            </div>
            <Button variant="destructive">
              <Icon name="Flag" size={16} className="mr-2" /> Сообщить о мошеннике
            </Button>
          </div>

          <div className="relative mt-6 max-w-md">
            <Icon name="Search" size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={stopSearch}
              onChange={(e) => setStopSearch(e.target.value)}
              placeholder="Поиск по телефону, ссылке или имени"
              className="h-11 pl-10"
            />
          </div>

          <div className="mt-6 overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50 text-left text-muted-foreground">
                  {['Имя', 'Телефон', 'Ссылка', 'Карта', 'Схема обмана', 'Дата', 'Статус'].map((h) => (
                    <th key={h} className="px-4 py-3 font-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredStop.map((row, i) => (
                  <tr key={i} className="border-b border-border/60 last:border-0 hover:bg-secondary/30">
                    <td className="px-4 py-3 font-500">{row.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.phone}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.link}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.card}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.scheme}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.date}</td>
                    <td className="px-4 py-3">
                      <Badge variant={row.status === 'Мошенник' ? 'destructive' : 'secondary'}>{row.status}</Badge>
                    </td>
                  </tr>
                ))}
                {filteredStop.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">Ничего не найдено</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <Icon name="Info" size={14} /> Список неполный. Отсутствие в списке не гарантирует добросовестность.
          </p>
        </div>
      </section>

      {/* VOLUNTEER CTA */}
      <section id="volunteer" className="container py-16 md:py-24">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/15 via-card to-card p-10 text-center md:p-16">
          <div className="mx-auto max-w-2xl">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Icon name="UserPlus" size={26} />
            </div>
            <h2 className="font-display text-3xl font-600 md:text-4xl">Станьте волонтёром</h2>
            <p className="mt-4 text-muted-foreground">
              Регистрация с одобрением: заявка проходит модерацию, после чего вы получаете
              доступ в личный кабинет с заявками, памяткой и настройкой уведомлений.
            </p>
            <Button size="lg" className="mt-7">
              <Icon name="UserPlus" size={18} className="mr-2" /> Зарегистрироваться
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/60 bg-card/40">
        <div className="container flex flex-col items-center justify-between gap-6 py-10 md:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Icon name="Radar" size={18} />
            </div>
            <span className="font-display text-sm tracking-wide">НАЙТИ · ПРОВЕРИТЬ · ПОМОЧЬ</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <a href="tel:89518125229" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Icon name="Phone" size={15} /> 8 951 812-52-29
            </a>
            <a href="https://vk.com/id1117400900" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Icon name="ExternalLink" size={15} /> vk.com/id1117400900
            </a>
          </div>
        </div>
        <div className="border-t border-border/60 py-4">
          <p className="container flex items-center justify-center gap-2 text-center text-xs text-destructive">
            <Icon name="TriangleAlert" size={14} /> Никому не переводите деньги без проверки. Настоящая помощь не берёт предоплату за «поиск».
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
