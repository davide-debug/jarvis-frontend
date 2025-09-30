-- Seed dati demo (Wesionary / Finanza Agevolata)
-- Clients
insert into public.clients (name, company, email, phone, notes) values
('Tommaso', 'TCP Tuscany Chemical Production srls', 'tommaso@tcp.example', '+39 333 0000001', 'Interessati a Multiplan 10 Premium. CDA 2025-09: pausa investimenti, riaprono valutazioni nel 2026.'),
('Luigi Petronzi', 'Petronzi Progressi Marmi', 'luigi.petronzi@example', '+39 333 0000002', 'Figlia: Maria. Opzioni Sabatini / Transizione 4.0 su macchinari marmo.'),
('Franco', 'ICOM Srl', 'franco@icom.example', '+39 333 0000003', 'Lead caldo: richiesta materiali bandi, follow-up commerciale.'),
('Stefano Pedrini', 'Novareti (Dolomiti Group)', 'stefano.pedrini@novareti.example', '+39 333 0000004', 'Contatto su efficienza energetica / progetti PNRR.');

-- Products (servizi/pacchetti)
insert into public.products (name, description, price) values
('Multiplan 10 Premium', 'Piano consulenziale con success fee a scaglioni e flat sopra soglia; include monitoraggio bandi e redazione domanda.', 7500),
('Multiplan 8 Monitor Plus', 'Monitoraggio agevolazioni continuo, alert e scouting settimanale, report mensile opportunità.', 2900),
('Jarvis AI Call Assistant', 'Assistente in-call: trascrizione, suggerimenti obiezioni, timeline, follow-up automatici.', 0);

-- Kanban Tasks
insert into public.tasks (title, status) values
('Preparare presentazione per COMUFFICIO Convention', 'todo'),
('Caricare fascicolo AGEA cliente Petronzi', 'inprogress'),
('Inviare preventivo Multiplan 10 Premium a TCP', 'done');

-- Costi
insert into public.costs (description, amount, category, period) values
('Abbonamento ChatGPT', 200, 'Software', '2025-09-30'),
('Trasferta Marmomac Verona', 350, 'Fiere', '2025-09-26'),
('Licenza Supabase', 25, 'Cloud', '2025-09-30');


-- Obiettivi
insert into public.goals (title, progress, deadline) values
('Chiudere 5 nuovi Multiplan entro Q4 2025', 40, '2025-12-31'),
('Attivare Jarvis in 3 call reali', 66, '2025-10-31'),
('Partecipare a 2 fiere entro fine anno', 50, '2025-12-20');

-- Logs realtime (demo)
insert into public.logs (message) values
('Jarvis avviato'),
('Nuovo cliente inserito: TCP Tuscany Chemical Production'),
('Task spostato: Preventivo Multiplan → Done');
