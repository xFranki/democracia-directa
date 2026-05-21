const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.info', 'guerrillamail.net',
  'guerrillamail.org', 'guerrillamail.de', 'grr.la', 'sharklasers.com',
  'spam4.me', 'trashmail.com', 'trashmail.me', 'trashmail.net', 'trashmail.at',
  'yopmail.com', 'yopmail.fr', 'cool.fr.nf', 'jetable.fr.nf', 'nospam.ze.tc',
  'nomail.xl.cx', 'mega.zik.dj', 'speed.1s.fr', 'courriel.fr.nf', 'moncourrier.fr.nf',
  'monemail.fr.nf', 'monmail.fr.nf', 'tempmail.com', 'tempmail.net', 'tempmail.org',
  'temp-mail.org', 'throwam.com', 'maildrop.cc', 'dispostable.com', 'fakeinbox.com',
  'getairmail.com', 'mailnesia.com', 'getnada.com', '10minutemail.com',
  '10minutemail.net', 'minutemail.com', 'spambox.us', 'mailzilla.com',
  'mailnull.com', 'spamgourmet.com', 'spamgourmet.net', 'spamgourmet.org',
  'spamevader.com', 'tempinbox.com', 'mailexpire.com', 'tempail.com',
  'throwaway.email', 'discard.email', 'mailtemp.net', 'spamhereplease.com',
  'spamfree24.org', 'spamfree.eu', 'spamoff.de', 'anonbox.net', 'filzmail.com',
  'mail-temporaire.fr', 'jetable.net', 'jetable.org', 'jetable.pp.ua',
  'mytemp.email', 'zymuying.com', 'trbvm.com', 'spam.la', 'nwldx.com',
]);

export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  return DISPOSABLE_DOMAINS.has(domain);
}
