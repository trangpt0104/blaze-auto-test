export const DEPLOYMENT_REGIONS = ['dev', 'staging'] as const;

export type DeploymentRegion = (typeof DEPLOYMENT_REGIONS)[number];

export function isDeploymentRegion(region: string): region is DeploymentRegion {
  return DEPLOYMENT_REGIONS.includes(region as DeploymentRegion);
}

export type DataByRegion<T> = Partial<Record<DeploymentRegion, T>>;
