/**
 * ftm-eac-install root group definition.
 *
 * When ftm-eac-install is used standalone, this defines the root group metadata.
 * When ftm-eac-install is composed as a plugin (e.g., with CommandRoot: 'eac'),
 * this becomes the group metadata for that prefix.
 *
 * @module
 */

import { Group } from '@fathym/cli';

export default Group('eac-install')
  .Description('EaC Install commands for scaffolding EaC projects');
