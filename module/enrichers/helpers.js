import { CHARACTERISTICS, DAMAGE } from '../constants/_index.js';

import { capitalize, getRollActor } from '../helpers.js';
import { enrichKnockback } from './enrich-knockback.js';
import { enrichTest, rollTest } from './enrich-test.js';

function registerCustomEnrichers() {
    CONFIG.TextEditor.enrichers.push({
        pattern: /@(?<enrichType>Test)\[(?:\|*(?<config>[^\]\[]*))\]/gi,
        enricher: enrichTest,
    });

    CONFIG.TextEditor.enrichers.push({
        pattern: /@(?<enrichType>Knockback)\[(?<distance>\d+)\]/gi,
        enricher: enrichKnockback,
    });

    document.body.addEventListener('click', rollAction);
    document.body.addEventListener('click', postRollToChat);
}

async function _getEnrichedOptions(match, options) {
    let { damageAmount, config, enrichType, distance } = match.groups;
    let data = {};
    config = config?.split('|');
    config?.forEach((option) => {
        let [key, value] = option.split('=');
        if (key && value) {
            if (!Number.isNaN(parseInt(value))) data[key] = Number(value);
            else data[key] = value.toLowerCase();
        }
    });

    data.enrichType = enrichType.toLowerCase();
    data.actor = options.actor ?? options.rollData?.parent;
    data.actorId = data.actor?.uuid;

    if (data.enrichType === 'damage') {
        data.item = options.item ?? (await fromUuid(options.messageData?.origin.item));
        if (Number.isNumeric(damageAmount)) damageAmount = Number(damageAmount);
        else damageAmount = 0;

        const kitDamage = data.item?.kitDamage ?? 0;
        data.damage = {
            amount: damageAmount + kitDamage,
            type: data.type in DAMAGE.TYPES ? data.type : 'untyped',
        };
        delete data.type;
    } else if (data.enrichType === 'knockback') {
        data.distance = distance;
    }

    // Remove characteristic from data if not valid characteristic or 'highest'
    if (data.characteristic && !(data.characteristic in CHARACTERISTICS) && data.characteristic !== 'highest') delete data.characteristic;

    return data;
}

function createRollLink({ enrichType, label, data, postToChat = false } = {}) {
    const span = document.createElement('span');
    span.classList.add('roll-container');

    const rollLink = document.createElement('a');
    rollLink.classList.add('roll-link');
    rollLink.classList.add(`roll-${enrichType}`);
    _addDataset(rollLink, data);
    rollLink.innerHTML = `<span class='roll-icons'><i class='fa-solid fa-dice-d6 fa-lg'></i><i class='fa-solid fa-dice-d6'></i></span> ${label}`;
    span.appendChild(rollLink);

    if (postToChat) {
        const toChatLink = document.createElement('a');
        toChatLink.classList.add('roll-to-chat');
        toChatLink.classList.add(`roll-${enrichType}-to-chat`);
        _addDataset(toChatLink, data);

        toChatLink.innerHTML = '<i class="fa-solid fa-message"></i>';
        span.appendChild(toChatLink);
    }

    return span;
}

function _addDataset(element, dataset, prefix = undefined) {
    for (const [key, value] of Object.entries(dataset)) {
        if (['input', 'values', 'actor', 'item'].includes(key) || !value) continue;
        if (typeof value === 'object') {
            _addDataset(element, value, key);
        } else {
            let datasetKey;
            if (prefix) {
                datasetKey = `${prefix}${capitalize(key)}`;
            } else datasetKey = key;
            element.dataset[datasetKey] = value;
        }
    }
}

async function rollAction(event) {
    const target = event.target.closest('.roll-link');
    if (!target) return;
    const { enrichType } = target.dataset;

    if (enrichType === 'test') rollTest(event);
    else return console.error('No accepted roll type provided; must be damage or test');
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
    else return console.error('No accepted roll type provided; must be damage');
}

export { _getEnrichedOptions, createRollLink, getRollContextData, registerCustomEnrichers };
