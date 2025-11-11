'use client';

import React, { useState } from 'react';
import Layout from '@/components/shared/organisms/Layout';
import {
  createPhenomenon,
  generateAIDraft,
} from '@/components/phenomenon/services/phenomenaApiService';
import { Phenomenon } from '@/types/phenomenon';
import {
  TextInput,
  Button,
  Box,
  Title,
  Group,
  Alert,
} from '@mantine/core';
import Link from 'next/link';

const CreatePhenomenonPage = () => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [newPhenomenon, setNewPhenomenon] = useState<Phenomenon | null>(null);

  const handleCreate = async () => {
    setLoading(true);
    const phenomenon = await createPhenomenon(title);
    setNewPhenomenon(phenomenon);
    setLoading(false);
  };

  const handleGenerate = async () => {
    setLoading(true);
    const phenomenon = await generateAIDraft(title);
    setNewPhenomenon(phenomenon);
    setLoading(false);
  };

  return (
    <Layout>
      <Box maw={600} mx="auto">
        <Title order={1} ta="center" mb="xl">
          Create New Phenomenon
        </Title>
        <TextInput
          label="Title"
          placeholder="Enter phenomenon title"
          value={title}
          onChange={(event) => setTitle(event.currentTarget.value)}
          mb="md"
        />
        <Group justify="space-between">
          <Button onClick={handleCreate} loading={loading}>
            Create
          </Button>
          <Button onClick={handleGenerate} loading={loading} color="teal">
            Generate with AI
          </Button>
        </Group>
        {newPhenomenon && (
          <Alert title="Success" color="green" mt="md">
            Successfully created phenomenon:{' '}
            <Link href={`/phenomena/${newPhenomenon.slug}`} passHref>
              {newPhenomenon.title}
            </Link>
          </Alert>
        )}
      </Box>
    </Layout>
  );
};

export default CreatePhenomenonPage;
