import * as pulumi from '@pulumi/pulumi'
import * as github from '@pulumi/github'
import * as gandi from '@pulumiverse/gandi'

import { commonRepositoryConfig, createDefaultBranch, createLabels } from './_common'
import { nameservers } from '../domains/powerd6org';

export const repository = new github.Repository('specificationRepository', {
  ...commonRepositoryConfig,
  name: 'specification',
  description: 'The open specification for the powerd6 system and tools',
  topics: [
    'specification',
    'json-schema',
    'developer-tools'
  ],
  homepageUrl: 'https://specification.powerd6.org',
  pages: {
    cname: 'specification.powerd6.org',
    source: {
      branch: 'main'
    }
  }
}, {
  protect: true
})

const { mainBranch, mainBranchProtection, defaultBranchRule } = createDefaultBranch('specificationRepository', repository)
const { labels } = createLabels('specificationRepository', repository)

export const TXT_githubpageschallengepowerd6specificationDnsRecord = new gandi.livedns.Record('TXT_githubpageschallengepowerd6specificationDnsRecord', {
  name: '_github-pages-challenge-powerd6.specification',
  ttl: 10800,
  type: 'TXT',
  values: ['"c0ff5e26529a675386942853f550d8"'],
  zone: 'powerd6.org'
}, {
  parent: nameservers,
})

export const CNAME_specificationDnsRecord = new gandi.livedns.Record('CNAME_specificationDnsRecord', {
  name: 'specification',
  ttl: 10800,
  type: 'CNAME',
  values: ['powerd6.github.io.'],
  zone: 'powerd6.org'
}, {
  parent: nameservers,
})

export const output = {
  repository: repository.name,
  mainBranch: mainBranch.branch,
  mainBranchProtection: mainBranchProtection.id,
  defaultBranchRule: defaultBranchRule.branch,
  labels: labels.map(l => l.name),
  githubPages: [
    TXT_githubpageschallengepowerd6specificationDnsRecord.href,
    CNAME_specificationDnsRecord.href
  ]
}
