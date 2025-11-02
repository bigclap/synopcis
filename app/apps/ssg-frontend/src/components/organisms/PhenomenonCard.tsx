import React from 'react';
import Link from 'next/link';
import { PhenomenonCardData } from '@/types/phenomenon';

type PhenomenonCardProps = {
  cardData: PhenomenonCardData;
};

const PhenomenonCard: React.FC<PhenomenonCardProps> = ({ cardData }) => {
  return (
    <aside className="phenomenon-card">
      <h2>Key Information</h2>
      <table>
        <tbody>
          {cardData.properties.map((prop, index) => (
            <tr key={index}>
              <th>
                <Link href={`/concepts/${prop.property.slug}`} legacyBehavior>
                  <a>{prop.property.text}</a>
                </Link>
              </th>
              <td>
                <Link href={`/concepts/${prop.value.slug}`} legacyBehavior>
                  <a>{prop.value.text}</a>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </aside>
  );
};

export default PhenomenonCard;
