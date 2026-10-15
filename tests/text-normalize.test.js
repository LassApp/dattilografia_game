import test from 'node:test'; import assert from 'node:assert/strict';
import { normalizeText, findUnsupported } from '../js/engine/text-normalize.js';
test('normalizza apostrofi, virgolette, trattini, spazi e a capo', () => assert.equal(normalizeText('L’“ciao” – va\u00A0bene…  \r\n  sì '), 'L\'"ciao" - va bene...\nsì'));
test('segnala i caratteri fuori dalla tastiera italiana', () => assert.deepEqual(findUnsupported('a→b€'), ['→']));
