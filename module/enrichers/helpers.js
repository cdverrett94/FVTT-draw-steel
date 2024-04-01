import { CHARACTERISTICS } from '../constants/_index.js';

import { getRollActor } from '../helpers.js';
import { enrichDamage, postDamageToChat, rollDamage } from './enrich-damage.js';

function registerCustomEnrichers() {
    CONFIG.TextEditor.enrichers.push({
        pattern: /@(?<type>Damage)\[(?<formula>[^\]\|]+)(?:\|*(?<config>[^\[\]]*))\]/gi,
        enricher: enrichDamage,
    });

    document.body.addEventListener('click', rollAction);
    document.body.addEventListener('click', postRollToChat);
}

function _getEnrichedOptions(match, options) {
    let { formula, config, type, characteristic } = match.groups;
    let data = {};
    config = config.split('|');
    config.forEach((option) => {
        let [key, value] = option.split('=');
        if (key && value) {
            if (!Number.isNaN(parseInt(value))) data[key] = Number(value);
            else data[key] = value.toLowerCase();
        }
    });

    data.edges ??= 0;
    data.banes ??= 0;
    data.actor = options.actor ?? options.rollData?.parent;
    data.actorId = data.actor?.uuid;
    data.item = options.item;
    data.replaceCharacteristic = data.replaceCharacteristic === 'false' ? false : true;

    if (type.toLowerCase() === 'damage') {
        data.baseFormula = formula;
    } else data.baseFormula = '2d6';

    // Remove characteristic from data if not valid characteristic or 'highest'
    if (data.characteristic && !(data.characteristic in CHARACTERISTICS) && data.characteristic !== 'highest') delete data.characteristic;

    return data;
}

function createRollLink(type, label, formula, dataset, postToChat = false) {
    const span = document.createElement('span');
    span.classList.add('roll-container');

    const rollLink = document.createElement('a');
    rollLink.classList.add('roll-link');
    rollLink.classList.add(`roll-${type}`);
    _addDataset(rollLink, dataset);
    rollLink.innerHTML = `<i class="fa-solid fa-dice-d6"></i> ${label}`;
    span.appendChild(rollLink);

    if (postToChat) {
        const toChatLink = document.createElement('a');
        toChatLink.classList.add('roll-to-chat');
        toChatLink.classList.add(`roll-${type}-to-chat`);
        _addDataset(toChatLink, dataset);

        toChatLink.dataset.replaceCharacteristic = false;
        toChatLink.innerHTML = '<i class="fa-solid fa-message"></i>';
        span.appendChild(toChatLink);
    }

    return span;
}

function _addDataset(element, dataset) {
    for (const [key, value] of Object.entries(dataset)) {
        if (!['input', 'values', 'actor', 'item'].includes(key) && value) element.dataset[key] = value;
    }
}

async function rollAction(event) {
    const target = event.target.closest('.roll-link');
    if (!target) return;

    const isDamage = target.classList.contains('roll-damage');
    if (isDamage) rollDamage(event);
    else return console.error('No accepted roll type provided; must be damage');
}

async function getRollContextData(dataset) {
    let { abilityName, actorId, baseFormula, edges, banes, characteristic, damageType, formula, skill, subskill, tn } = {
        ...dataset,
    };

    edges = Math.abs(Number(edges) || 0);
    banes = Math.abs(Number(banes) || 0);

    let actor;
    if (dataset.actorId) actor = await fromUuid(actorId);
    else actor = await getRollActor();

    return { abilityName, actor, actorId, baseFormula, edges, banes, characteristic, damageType, formula, skill, subskill, tn };
}

async function postRollToChat(event) {
    const target = event.target.closest('.roll-to-chat');
    if (!target) return;

    if (target.classList.contains('roll-damage-to-chat')) postDamageToChat({ dataset: target.dataset });
    else return console.error('No accepted roll type provided; must be damage');
}

export { _getEnrichedOptions, createRollLink, getRollContextData, registerCustomEnrichers };
