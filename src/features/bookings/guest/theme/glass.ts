import type { ViewStyle } from 'react-native';

import { C, pine } from './index';

// Card materials. (The names are from an earlier translucent look; cards are now solid, so text always has full contrast.)

/** Light card with dark text. */
export const glassCard: ViewStyle = { backgroundColor: C.white, borderWidth: 0, elevation: 0, shadowOpacity: 0, boxShadow: `0px 10px 28px ${pine(0.08)}` };

/** Deep Pine card with cream text. */
export const glassCardDark: ViewStyle = { backgroundColor: C.deep, borderWidth: 0, elevation: 0, shadowOpacity: 0 };

/** For a selected state that adds its own elevation on top of a card. */
export const glassFlat: ViewStyle = { elevation: 0, shadowOpacity: 0 };

/** Screen background. */
export const canvas: ViewStyle = { flex: 1, backgroundColor: C.sand };
