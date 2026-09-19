import type common from "@ohos:app.ability.common";
import type Want from "@ohos:app.ability.Want";
interface OpenLinkOption {
    appLinkingOnly: boolean;
}
export async function openVideoLink(context: common.Context, url: string): Promise<void> {
    const target = url.trim();
    if (target.length === 0) {
        return;
    }
    const abilityContext = context as common.UIAbilityContext;
    try {
        const option: OpenLinkOption = { appLinkingOnly: false };
        await abilityContext.openLink(target, option);
    }
    catch (openLinkError) {
        const want: Want = {
            action: 'ohos.want.action.viewData',
            entities: ['entity.system.browsable'],
            uri: target
        };
        try {
            await abilityContext.startAbility(want);
        }
        catch (startError) {
        }
    }
}
export function extractOpenVideoUrl(want: Want): string {
    if (want.uri && /^https?:\/\//i.test(want.uri)) {
        return want.uri;
    }
    const params = want.parameters;
    if (!params) {
        return '';
    }
    const direct = params['openVideoUrl'];
    if (typeof direct === 'string' && direct.length > 0) {
        return direct;
    }
    const nested = params['params'];
    if (typeof nested === 'string' && nested.length > 0) {
        try {
            const parsed = JSON.parse(nested) as Record<string, string>;
            const fromJson = parsed['openVideoUrl'];
            if (fromJson && fromJson.length > 0) {
                return fromJson;
            }
        }
        catch (parseError) {
            return '';
        }
    }
    if (typeof nested === 'object' && nested) {
        const parsed = nested as Record<string, Object>;
        const value = parsed['openVideoUrl'];
        if (typeof value === 'string') {
            return value;
        }
    }
    return '';
}
